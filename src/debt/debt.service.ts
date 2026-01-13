import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { Debt } from './entities/debt.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PAYMENT_METHOD } from '@/shared/enums/enum';

@Injectable()
export class DebtService {
  constructor(@InjectRepository(Debt) private readonly debtRepo: Repository<Debt>) {}

  create(createDebtDto: CreateDebtDto, user: Rootuser) {
    const new_debt = new Debt();

    new_debt.Category = createDebtDto.Category;
    new_debt.Description = createDebtDto.Description;
    new_debt.DueDate = createDebtDto.DueDate;
    new_debt.LoanBalance = createDebtDto.LoanBalance;
    new_debt.MonthlyBudget = createDebtDto.MonthlyBudget;
    new_debt.PaymentMethod = createDebtDto.PaymentMethod;
    new_debt.NickName = createDebtDto.NickName;
    new_debt.Owner = createDebtDto.Owner;
    new_debt.Frequency = createDebtDto.Frequency;

    new_debt.Root = user;

    return this.debtRepo.save(new_debt);
  }

  findAll(user: Rootuser) {
    return this.debtRepo.createQueryBuilder('debts').where('debts.rootid = :id', { id: user.id }).getMany();
  }

  findOne(id: number) {
    return this.debtRepo.findOne({ where: { id } });
  }

  async update(id: number, updateDebtDto: UpdateDebtDto) {
    const new_debt = await this.debtRepo.findOne({ where: { id } });

    new_debt.Category = updateDebtDto.Category;
    new_debt.DueDate = updateDebtDto.DueDate;
    new_debt.LoanBalance = updateDebtDto.LoanBalance;
    new_debt.MonthlyBudget = updateDebtDto.MonthlyBudget;
    new_debt.PaymentMethod = updateDebtDto.PaymentMethod;
    new_debt.NickName = updateDebtDto.NickName;

    if (updateDebtDto.Description) new_debt.Description = updateDebtDto.Description;
    new_debt.Frequency = updateDebtDto.Frequency;

    new_debt.Owner = updateDebtDto.Owner;

    return this.debtRepo.save(new_debt);
  }

  async remove(id: number) {
    const new_debt = await this.debtRepo.findOne({ where: { id } });

    new_debt.DueDate = '01';
    new_debt.LoanBalance = null;
    new_debt.MonthlyBudget = null;
    new_debt.NickName = '';
    new_debt.PaymentMethod = PAYMENT_METHOD.AUTO_DEBIT;

    return this.debtRepo.save(new_debt);
  }
}
