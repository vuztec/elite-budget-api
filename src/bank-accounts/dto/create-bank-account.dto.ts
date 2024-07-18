import { Owner, TRANSACTION_TYPE } from '@/shared/enums/enum';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateBankAccountNameDto {
  @IsString()
  Owner: Owner;

  @IsString()
  Name: string;

  @IsNumber()
  OpeningBalance: Number;
}

export class CreateBankAccountTransactionDto {
  @IsString()
  Owner: Owner;

  @IsString()
  Description: string;

  @IsString()
  Date: Date;

  @IsString()
  Type: TRANSACTION_TYPE;

  @IsNumber()
  Amount: Number;

  @IsBoolean()
  IsCleared: boolean;

  @IsNumber()
  BankAccountNameId: number;
}
