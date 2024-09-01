import { IsEnum, IsNumber } from 'class-validator';

export class CreatePriceDto {
  @IsNumber()
  Amount: number;
}
