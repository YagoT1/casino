import { IsNumber, Min } from 'class-validator';

export class PlaySlotDto {
  @IsNumber()
  @Min(1)
  amount!: number;
}
