import { PartialType } from '@nestjs/swagger';
import { CreateBankAccountNameDto } from './create-bank-account.dto';

export class UpdateBankAccountNameDto extends PartialType(CreateBankAccountNameDto) {}
