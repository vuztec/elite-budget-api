import { Owner, TRANSACTION_TYPE } from '@/shared/enums/enum';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

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
  Description: string;

  @IsString()
  @IsOptional()
  Date: Date;

  @IsEnum(TRANSACTION_TYPE)
  Type: TRANSACTION_TYPE;

  @IsNumber()
  Amount: Number;

  @IsBoolean()
  IsCleared: boolean;

  @IsNumber()
  BankName: number;
}
