import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { WalletService } from 'src/wallet/wallet.service';
import { GamesService } from 'src/games/games.service';
import { Roles } from 'src/common/guards/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard)
@Roles('admin')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly walletService: WalletService,
    private readonly gamesService: GamesService,
  ) {}

  @Get('users')
  users() {
    return this.usersService.listAll();
  }

  @Get('bets')
  bets() {
    return this.gamesService.listAllBets();
  }

  @Get('balances')
  async balances() {
    const users = await this.usersService.listAll();
    const rows = await Promise.all(
      users.map(async (user) => ({
        userId: user.id,
        email: user.email,
        balance: await this.walletService.getBalance(user.id),
      })),
    );
    return rows;
  }
}
