import { Injectable } from '@nestjs/common';
import { CreateBankAccountNameDto, CreateBankAccountTransactionDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountNameDto, UpdateBankAccountTransactionDto } from './dto/update-bank-account.dto';
import { BankAccountName } from './entities/bank-account-name.entity';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccountTransaction } from './entities/bank-account-transaction.entity';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccountName) private readonly bankNameRepo: Repository<BankAccountName>,
    @InjectRepository(BankAccountTransaction) private readonly bankTransactionRepo: Repository<BankAccountTransaction>,
  ) {}
  createName(createBankAccountDto: CreateBankAccountNameDto, user: Rootuser) {
    const new_account_name = new BankAccountName();

    new_account_name.Name = createBankAccountDto.Name;
    new_account_name.Owner = createBankAccountDto.Owner;
    new_account_name.OpeningBalance = createBankAccountDto.OpeningBalance;

    new_account_name.Root = user;

    return this.bankNameRepo.save(new_account_name);
  }

  async createTransaction(createBankAccountDto: CreateBankAccountTransactionDto, user: Rootuser) {
    const new_transaction = new BankAccountTransaction();

    new_transaction.Amount = createBankAccountDto.Amount;
    new_transaction.BankAccountName = await this.bankNameRepo.findOneBy({ id: createBankAccountDto.BankName });
    new_transaction.Date = createBankAccountDto.Date;
    new_transaction.Description = createBankAccountDto.Description;
    new_transaction.IsCleared = createBankAccountDto.IsCleared;
    new_transaction.Taxable = createBankAccountDto.Taxable;
    new_transaction.Type = createBankAccountDto.Type;
    new_transaction.Root = user;

    return this.bankTransactionRepo.save(new_transaction);
  }

  findAllNames(user: Rootuser) {
    return this.bankNameRepo.createQueryBuilder('names').where('names.rootid = :id', { id: user.id }).getMany();
  }

  findAllTransactions(user: Rootuser) {
    return this.bankTransactionRepo
      .createQueryBuilder('transaction')
      .where('transaction.rootid = :id', { id: user.id })
      .leftJoinAndSelect('transaction.BankAccountName', 'BankAccountName')
      .getMany();
  }

  findOneName(id: number) {
    return this.bankNameRepo.findOneBy({ id });
  }

  findOneTransaction(id: number) {
    return this.bankTransactionRepo.findOne({ where: { id }, relations: ['BankAccountName'] });
  }

  async updateName(id: number, updateBankAccountDto: UpdateBankAccountNameDto) {
    const new_account_name = await this.bankNameRepo.findOne({ where: { id } });

    new_account_name.Name = updateBankAccountDto.Name;
    new_account_name.Owner = updateBankAccountDto.Owner;
    new_account_name.OpeningBalance = updateBankAccountDto.OpeningBalance;

    return this.bankNameRepo.save(new_account_name);
  }

  async updateTransaction(id: number, updateBankAccountDto: UpdateBankAccountTransactionDto) {
    const new_transaction = await this.bankTransactionRepo.findOne({ where: { id } });

    new_transaction.Amount = updateBankAccountDto.Amount;
    new_transaction.BankAccountName = await this.bankNameRepo.findOneBy({ id: updateBankAccountDto.BankName });
    new_transaction.Date = updateBankAccountDto.Date;
    new_transaction.Description = updateBankAccountDto.Description;
    new_transaction.IsCleared = updateBankAccountDto.IsCleared;
    new_transaction.Taxable = updateBankAccountDto.Taxable;
    new_transaction.Type = updateBankAccountDto.Type;

    return this.bankTransactionRepo.save(new_transaction);
  }

  async updateTransactionStatus(id: number) {
    const new_transaction = await this.bankTransactionRepo.findOne({ where: { id } });

    new_transaction.IsCleared = !new_transaction.IsCleared;

    return this.bankTransactionRepo.save(new_transaction);
  }

  async updateTransactionTax(id: number) {
    const new_transaction = await this.bankTransactionRepo.findOne({ where: { id } });

    new_transaction.Taxable = !new_transaction.Taxable;

    return this.bankTransactionRepo.save(new_transaction);
  }

  async removeName(id: number) {
    return this.bankNameRepo.delete(id);
  }

  removeTransaction(id: number) {
    return this.bankTransactionRepo.delete(id);
  }
}
