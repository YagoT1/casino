import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { UsersModule } from 'src/users/users.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), UsersModule, WalletModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
