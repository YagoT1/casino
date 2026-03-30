import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GamesService } from './games.service';
import { PlaySlotDto } from './dto/play-slot.dto';
import { PlayBlackjackDto } from './dto/play-blackjack.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  games() {
    return this.gamesService.listGames();
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  history(@Req() req: { user: { sub: string } }) {
    return this.gamesService.history(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('slot/play')
  slot(@Req() req: { user: { sub: string } }, @Body() dto: PlaySlotDto) {
    return this.gamesService.playSlot(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('blackjack/play')
  blackjack(@Req() req: { user: { sub: string } }, @Body() dto: PlayBlackjackDto) {
    return this.gamesService.playBlackjack(req.user.sub, dto);
  }
}
