import { Frequency, Owner } from '@/shared/enums/enum';
import { IsNumber, IsString } from 'class-validator';

export class CreateIncomeDto {
  @IsString()
  Owner: Owner;

  @IsString()
  Frequency: Frequency;

  @IsString()
  IncomeSource: string;

  @IsString()
  NickName: string;

  @IsNumber()
  GrossAmount: Number;

  @IsNumber()
  NetAmount: Number;
}
