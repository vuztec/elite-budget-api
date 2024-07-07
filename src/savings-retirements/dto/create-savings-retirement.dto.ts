import { Owner, PAYMENT_METHOD, SAV_RET_TYPE } from '@/shared/enums/enum';
import { IsNumber, IsString } from 'class-validator';

export class CreateSavingsRetirementDto {
  @IsString()
  Owner: Owner;

  @IsNumber()
  MarketValue: Number;

  @IsNumber()
  MonthlyBudget: Number;

  @IsString()
  Description: string;

  @IsString()
  PaymentMethod: PAYMENT_METHOD;

  @IsString()
  DueDate: Date;

  @IsString()
  Category: SAV_RET_TYPE;
}
