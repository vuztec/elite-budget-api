import { Frequency, Owner, PAYMENT_METHOD, SAV_RET_TYPE } from '@/shared/enums/enum';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSavingsRetirementDto {
  @IsString()
  Owner: Owner;

  @IsNumber()
  MarketValue: number;

  @IsNumber()
  @IsOptional()
  MonthlyBudget?: number;

  @IsString()
  Description: string;

  @IsString()
  NickName: string;

  @IsString()
  @IsOptional()
  PaymentMethod: PAYMENT_METHOD;

  @IsString()
  @IsOptional()
  DueDate: string;

  @IsString()
  Category: SAV_RET_TYPE;

  @IsEnum(Frequency)
  @IsOptional()
  Frequency: Frequency;
}
