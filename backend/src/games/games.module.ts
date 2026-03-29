import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Bet } from './entities/bet.entity';
import { Game } from './entities/game.entity';
import { WalletModule } from 'src/wallet/wallet.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bet, Game]), WalletModule, UsersModule],
  providers: [GamesService],
  controllers: [GamesController],
  exports: [TypeOrmModule],
})
export class GamesModule {}
