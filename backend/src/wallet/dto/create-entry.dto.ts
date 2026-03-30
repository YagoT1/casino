import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateEntryDto {
  @IsIn(['deposit', 'withdrawal', 'bet', 'win', 'bonus'])
  type!: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus';

  @IsIn(['credit', 'debit'])
  direction!: 'credit' | 'debit';

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsOptional()
  @IsString()
  referenceId!: string;

  @IsOptional()
  @IsString()
  metadata!: string;
}
