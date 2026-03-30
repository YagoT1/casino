import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletService } from 'src/wallet/wallet.service';
import { UsersService } from 'src/users/users.service';
import { Bet } from './entities/bet.entity';
import { Game } from './entities/game.entity';
import { PlaySlotDto } from './dto/play-slot.dto';
import { PlayBlackjackDto } from './dto/play-blackjack.dto';
import { spinSlot } from './engine/slot.engine';
import { runBlackjack } from './engine/blackjack.engine';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Bet) private readonly betRepo: Repository<Bet>,
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    private readonly walletService: WalletService,
    private readonly usersService: UsersService,
  ) {}

  listGames() {
    return this.gameRepo.find({ where: { enabled: true } });
  }

  async playSlot(userId: string, dto: PlaySlotDto) {
    const result = spinSlot();
    return this.resolveBet(userId, 'slot-machine', dto.amount, result, result.multiplier);
  }

  async playBlackjack(userId: string, dto: PlayBlackjackDto) {
    const result = runBlackjack(dto.strategy);
    return this.resolveBet(userId, 'blackjack', dto.amount, result, result.multiplier);
  }

  history(userId: string) {
    return this.betRepo.find({
      where: { user: { id: userId } },
      relations: ['game'],
      order: { createdAt: 'DESC' },
    });
  }

  listAllBets() {
    return this.betRepo.find({ relations: ['game', 'user'], order: { createdAt: 'DESC' } });
  }

  private async resolveBet(
    userId: string,
    gameSlug: string,
    amount: number,
    result: Record<string, unknown>,
    multiplier: number,
  ) {
    const user = await this.usersService.findById(userId);
    const game = await this.gameRepo.findOneByOrFail({ slug: gameSlug });
    const payout = amount * multiplier;

    await this.walletService.addEntry(userId, {
      type: 'bet',
      direction: 'debit',
      amount,
      metadata: `${gameSlug} wager`,
    });

    if (payout > 0) {
      await this.walletService.addEntry(userId, {
        type: 'win',
        direction: 'credit',
        amount: payout,
        metadata: `${gameSlug} payout`,
      });
    }

    const bet = this.betRepo.create({
      user: user!,
      game,
      amount: amount.toFixed(2),
      payout: payout.toFixed(2),
      result,
    });

    await this.betRepo.save(bet);
    const balance = await this.walletService.getBalance(userId);

    return { betId: bet.id, result, payout, balance };
  }
}
