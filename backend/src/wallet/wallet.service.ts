import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LedgerTransaction } from './entities/ledger-transaction.entity';
import { UsersService } from 'src/users/users.service';
import { CreateEntryDto } from './dto/create-entry.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(LedgerTransaction)
    private readonly txRepo: Repository<LedgerTransaction>,
    private readonly usersService: UsersService,
  ) {}

  async addEntry(userId: string, dto: CreateEntryDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    if (dto.direction === 'debit') {
      const current = await this.getBalance(userId);
      if (current < dto.amount) {
        throw new BadRequestException('Insufficient funds');
      }
    }

    const tx = this.txRepo.create({
      ...dto,
      amount: dto.amount.toFixed(2),
      user,
    });
    return this.txRepo.save(tx);
  }

  async getBalance(userId: string) {
    const credits = await this.txRepo
      .createQueryBuilder('tx')
      .select('COALESCE(SUM(CAST(tx.amount as numeric)),0)', 'sum')
      .where('tx.userId = :userId', { userId })
      .andWhere('tx.direction = :direction', { direction: 'credit' })
      .getRawOne<{ sum: string }>();

    const debits = await this.txRepo
      .createQueryBuilder('tx')
      .select('COALESCE(SUM(CAST(tx.amount as numeric)),0)', 'sum')
      .where('tx.userId = :userId', { userId })
      .andWhere('tx.direction = :direction', { direction: 'debit' })
      .getRawOne<{ sum: string }>();

    return Number(credits?.sum || 0) - Number(debits?.sum || 0);
  }

  history(userId: string) {
    return this.txRepo.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' } });
  }
}
