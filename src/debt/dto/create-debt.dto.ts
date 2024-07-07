import { DEBT_CATEGORY, Owner, PAYMENT_METHOD } from '@/shared/enums/enum';
import { IsNumber, IsString } from 'class-validator';

export class CreateDebtDto {
  @IsString()
  Owner: Owner;

  @IsNumber()
  LoanBalance: Number;

  @IsNumber()
  MonthlyBudget: Number;

  @IsString()
  Description: string;

  @IsString()
  PaymentMethod: PAYMENT_METHOD;

  @IsString()
  DueDate: Date;

  @IsString()
  Category: DEBT_CATEGORY;
}
