import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { PaymentDto } from './dto/payment.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Req() req: { user: { sub: string } }, @Body() dto: PaymentDto) {
    return this.paymentsService.create(req.user.sub, dto);
  }

  @Get('history')
  history(@Req() req: { user: { sub: string } }) {
    return this.paymentsService.history(req.user.sub);
  }
}
