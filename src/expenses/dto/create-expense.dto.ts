import { Owner, PAYMENT_METHOD } from '@/shared/enums/enum';
import { IsNumber, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  Owner: Owner;

  @IsNumber()
  MarketValue: Number;

  @IsNumber()
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
