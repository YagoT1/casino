import { IsIn, IsNumber, Min } from 'class-validator';

export class PaymentDto {
  @IsIn(['deposit', 'withdrawal'])
  type: 'deposit' | 'withdrawal';

  @IsNumber()
  @Min(1)
  amount: number;
}
