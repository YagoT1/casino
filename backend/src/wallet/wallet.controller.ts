import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';
import { CreateEntryDto } from './dto/create-entry.dto';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  async balance(@Req() req: { user: { sub: string } }) {
    const balance = await this.walletService.getBalance(req.user.sub);
    return { balance };
  }

  @Get('history')
  history(@Req() req: { user: { sub: string } }) {
    return this.walletService.history(req.user.sub);
  }

  @Post('entry')
  entry(@Req() req: { user: { sub: string } }, @Body() dto: CreateEntryDto) {
    return this.walletService.addEntry(req.user.sub, dto);
  }
}
