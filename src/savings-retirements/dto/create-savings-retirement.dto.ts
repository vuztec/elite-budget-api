import { Owner, PAYMENT_METHOD, SAV_RET_TYPE } from '@/shared/enums/enum';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSavingsRetirementDto {
  @IsString()
  Owner: Owner;

  @IsNumber()
  MarketValue: Number;

  @IsNumber()
  @IsOptional()
  MonthlyBudget?: Number;

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
}
