import { PartialType } from '@nestjs/swagger';
import { CreateBankAccountNameDto, CreateBankAccountTransactionDto } from './create-bank-account.dto';

export class UpdateBankAccountNameDto extends PartialType(CreateBankAccountNameDto) {}

export class UpdateBankAccountTransactionDto extends PartialType(CreateBankAccountTransactionDto) {}
