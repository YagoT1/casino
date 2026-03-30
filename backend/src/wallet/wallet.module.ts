import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { LedgerTransaction } from './entities/ledger-transaction.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerTransaction]), UsersModule],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService, TypeOrmModule],
})
export class WalletModule {}
