import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WalletService } from 'src/wallet/wallet.service';
import { Payment } from './entities/payment.entity';
import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    private readonly usersService: UsersService,
    private readonly walletService: WalletService,
  ) {}

  async create(userId: string, dto: PaymentDto) {
    const user = await this.usersService.findById(userId);
    const payment = await this.paymentRepo.save(
      this.paymentRepo.create({
        user: user!,
        provider: 'MercadoPago-Mock',
        type: dto.type,
        amount: dto.amount.toFixed(2),
        status: 'pending',
      }),
    );

    payment.status = 'approved';
    await this.paymentRepo.save(payment);

    await this.walletService.addEntry(userId, {
      type: dto.type,
      direction: dto.type === 'deposit' ? 'credit' : 'debit',
      amount: dto.amount,
      referenceId: payment.id,
      metadata: payment.provider,
    });

    return payment;
  }

  history(userId: string) {
    return this.paymentRepo.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' } });
  }
}
