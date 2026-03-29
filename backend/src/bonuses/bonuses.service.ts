import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bonus } from './entities/bonus.entity';
import { UsersService } from 'src/users/users.service';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class BonusesService {
  constructor(
    @InjectRepository(Bonus) private readonly bonusRepo: Repository<Bonus>,
    private readonly usersService: UsersService,
    private readonly walletService: WalletService,
    private readonly configService: ConfigService,
  ) {}

  async grantWelcomeBonus(userId: string) {
    const user = await this.usersService.findById(userId);
    const amount = Number(this.configService.get('WELCOME_BONUS', 50));
    const rollover = Number(this.configService.get('WELCOME_ROLLOVER', 5));

    const bonus = await this.bonusRepo.save(
      this.bonusRepo.create({
        user: user!,
        name: 'Welcome Bonus',
        amount: amount.toFixed(2),
        rolloverMultiplier: rollover,
      }),
    );

    await this.walletService.addEntry(userId, {
      type: 'bonus',
      direction: 'credit',
      amount,
      referenceId: bonus.id,
      metadata: `rollover:${rollover}`,
    });

    return bonus;
  }

  list(userId: string) {
    return this.bonusRepo.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' } });
  }
}
