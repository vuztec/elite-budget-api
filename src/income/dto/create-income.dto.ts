import { Frequency, Owner } from '@/shared/enums/enum';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIncomeDto {
  @IsEnum(Owner)
  @IsOptional()
  Owner: Owner;

  @IsEnum(Frequency)
  @IsOptional()
  Frequency: Frequency;

  @IsString()
  IncomeSource: string;

  @IsString()
  NickName: string;

  @IsNumber()
  GrossAmount: number;

  @IsNumber()
  NetAmount: number;
}
