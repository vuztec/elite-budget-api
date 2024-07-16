import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { Expense } from './entities/expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExpensesService {
  constructor(@InjectRepository(Expense) private readonly expenseRepo: Repository<Expense>) {}

  create(createExpenseDto: CreateExpenseDto, user: Rootuser) {
    const new_expense = new Expense();
    new_expense.Category = createExpenseDto.Category;
    new_expense.Description = createExpenseDto.Description;
    new_expense.DueDate = createExpenseDto.DueDate;
    new_expense.LoanBalance = createExpenseDto.LoanBalance;
    new_expense.MonthlyBudget = createExpenseDto.MonthlyBudget;
    new_expense.MarketValue = createExpenseDto.MarketValue;
    new_expense.Owner = createExpenseDto.Owner;
    new_expense.PaymentMethod = createExpenseDto.PaymentMethod;
    new_expense.NickName = createExpenseDto.NickName;

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
    new_expense.Category = updateExpenseDto.Category;
    new_expense.Description = updateExpenseDto.Description;
    new_expense.DueDate = updateExpenseDto.DueDate;
    new_expense.LoanBalance = updateExpenseDto.LoanBalance;
    new_expense.MonthlyBudget = updateExpenseDto.MonthlyBudget;
    new_expense.MarketValue = updateExpenseDto.MarketValue;
    new_expense.Owner = updateExpenseDto.Owner;
    new_expense.PaymentMethod = updateExpenseDto.PaymentMethod;
    new_expense.NickName = updateExpenseDto.NickName;

    return this.expenseRepo.save(new_expense);
  }

  remove(id: number) {
    return this.expenseRepo.delete(id);
  }
}
