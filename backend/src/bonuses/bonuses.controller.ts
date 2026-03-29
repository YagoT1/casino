import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BonusesService } from './bonuses.service';

@Controller('bonuses')
@UseGuards(JwtAuthGuard)
export class BonusesController {
  constructor(private readonly bonusesService: BonusesService) {}

  @Get()
  list(@Req() req: { user: { sub: string } }) {
    return this.bonusesService.list(req.user.sub);
  }
}
