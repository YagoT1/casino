import { IsIn, IsNumber, Min } from 'class-validator';

export class PlayBlackjackDto {
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsIn(['hit', 'stand'])
  strategy!: 'hit' | 'stand';
}
