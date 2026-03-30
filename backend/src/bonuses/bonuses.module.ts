import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bonus } from './entities/bonus.entity';
import { BonusesService } from './bonuses.service';
import { BonusesController } from './bonuses.controller';
import { UsersModule } from 'src/users/users.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bonus]), UsersModule, forwardRef(() => WalletModule)],
  providers: [BonusesService],
  controllers: [BonusesController],
  exports: [BonusesService],
})
export class BonusesModule {}
