import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from 'src/users/users.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [UsersModule, WalletModule, GamesModule],
  controllers: [AdminController],
})
export class AdminModule {}
