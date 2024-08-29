import { Owner, PAYMENT_METHOD } from '@/shared/enums/enum';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  Owner: Owner;

  @IsNumber()
  @IsOptional()
  MarketValue: Number;

  @IsNumber()
  @IsOptional()
  LoanBalance: Number;

  @IsNumber()
  MonthlyBudget: Number;

  @IsString()
  Description: string;

  @IsString()
  NickName: string;

  @IsString()
  PaymentMethod: PAYMENT_METHOD;

  @IsString()
  DueDate: string;
}
