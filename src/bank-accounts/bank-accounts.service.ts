import { Injectable } from '@nestjs/common';
import { CreateBankAccountNameDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountNameDto } from './dto/update-bank-account.dto';

@Injectable()
export class BankAccountsService {
  create(createBankAccountDto: CreateBankAccountNameDto) {
    return 'This action adds a new bankAccount';
  }

  findAll() {
    return `This action returns all bankAccounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bankAccount`;
  }

  update(id: number, updateBankAccountDto: UpdateBankAccountNameDto) {
    return `This action updates a #${id} bankAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} bankAccount`;
  }
}
