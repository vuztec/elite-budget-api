import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { Expense } from './entities/expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PAYMENT_METHOD } from '@/shared/enums/enum';

@Injectable()
export class ExpensesService {
  constructor(@InjectRepository(Expense) private readonly expenseRepo: Repository<Expense>) {}

  create(createExpenseDto: CreateExpenseDto, user: Rootuser) {
    const new_expense = new Expense();
    // new_expense.Category = createExpenseDto.Category;
    new_expense.Description = createExpenseDto.Description;
    new_expense.DueDate = createExpenseDto.DueDate;
    new_expense.LoanBalance = createExpenseDto.LoanBalance;
    new_expense.MonthlyBudget = createExpenseDto.MonthlyBudget;
    new_expense.MarketValue = createExpenseDto.MarketValue;
    new_expense.Owner = createExpenseDto.Owner;
    new_expense.PaymentMethod = createExpenseDto.PaymentMethod;
    new_expense.NickName = createExpenseDto.NickName;
    new_expense.Frequency = createExpenseDto.Frequency;

    new_expense.Root = user;

    return this.expenseRepo.save(new_expense);
  }

  findAll(user: Rootuser) {
    return this.expenseRepo.createQueryBuilder('expense').where('expense.rootid = :id', { id: user.id }).getMany();
  }

  findOne(id: number) {
    return this.expenseRepo.findOne({ where: { id } });
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    const new_expense = await this.expenseRepo.findOne({ where: { id } });

    new_expense.DueDate = updateExpenseDto.DueDate;
    new_expense.LoanBalance = updateExpenseDto.LoanBalance;
    new_expense.MonthlyBudget = updateExpenseDto.MonthlyBudget;
    new_expense.MarketValue = updateExpenseDto.MarketValue;
    new_expense.Owner = updateExpenseDto.Owner;
    new_expense.PaymentMethod = updateExpenseDto.PaymentMethod;
    new_expense.NickName = updateExpenseDto.NickName;

    if (updateExpenseDto.Description) new_expense.Description = updateExpenseDto.Description;
    new_expense.Frequency = updateExpenseDto.Frequency;

    return this.expenseRepo.save(new_expense);
  }

  async remove(id: number) {
    const new_expense = await this.expenseRepo.findOne({ where: { id } });

    new_expense.DueDate = '01';
    new_expense.LoanBalance = null;
    new_expense.MonthlyBudget = null;
    new_expense.MarketValue = null;
    new_expense.PaymentMethod = PAYMENT_METHOD.AUTO_DEBIT;
    new_expense.NickName = null;
    // new_expense.Owner = null;

    return this.expenseRepo.save(new_expense);
  }
}
