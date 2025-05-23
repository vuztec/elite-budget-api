import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateRootuserDto } from './dto/create-rootuser.dto';
import { UpdateRootuserDto, UpdateUserAutoRenewalDto } from './dto/update-rootuser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rootuser } from './entities/rootuser.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  debt_data,
  expenses_data,
  goals_data,
  income_data,
  retirements_data,
  savings_data,
} from '@/shared/utils/default.data';
import { Income } from '@/income/entities/income.entity';
import { SavingsRetirement } from '@/savings-retirements/entities/savings-retirement.entity';
import { SAV_RET_TYPE, Status } from '@/shared/enums/enum';
import { Debt } from '@/debt/entities/debt.entity';
import { Expense } from '@/expenses/entities/expense.entity';
import { ExtraPayCheck } from '@/extra-pay-checks/entities/extra-pay-check.entity';
import { Goal } from '@/goals/entities/goal.entity';
import { PaymentService } from '@/payment/payment.service';

@Injectable()
export class RootusersService {
  constructor(
    @InjectRepository(Rootuser) private readonly rootuserRepo: Repository<Rootuser>,
    @InjectRepository(Income) private readonly incomeRepo: Repository<Income>,
    @InjectRepository(SavingsRetirement) private readonly saveRetRep: Repository<SavingsRetirement>,
    @InjectRepository(Debt) private readonly debtRepo: Repository<Debt>,
    @InjectRepository(Expense) private readonly expenseRepo: Repository<Expense>,
    @InjectRepository(ExtraPayCheck) private readonly payCheckRepo: Repository<ExtraPayCheck>,
    @InjectRepository(Goal) private readonly goalRepo: Repository<Goal>,
    private readonly paymentService: PaymentService,
  ) {}

  async create(createRootuserDto: CreateRootuserDto) {
    const isUserExist = await this.rootuserRepo.findOneBy({
      Email: createRootuserDto.Email,
    });

    if (isUserExist) {
      throw new ForbiddenException('User already exists with this email address');
    }

    const new_user = new Rootuser();

    new_user.FullName = createRootuserDto.FullName;
    new_user.Email = createRootuserDto.Email;
    new_user.Country = createRootuserDto.Country;
    new_user.Separator = createRootuserDto.Separator;

    if (createRootuserDto.FreeAccess !== undefined) new_user.FreeAccess = createRootuserDto.FreeAccess;
    if (createRootuserDto.DateFormat) new_user.DateFormat = createRootuserDto.DateFormat;
    if (createRootuserDto.Currency) new_user.Currency = createRootuserDto.Currency;
    if (createRootuserDto.SelfAge) new_user.SelfAge = createRootuserDto.SelfAge;
    if (createRootuserDto.PartnerAge) new_user.PartnerAge = createRootuserDto.PartnerAge;
    if (createRootuserDto.Status) new_user.Status = createRootuserDto.Status;

    new_user.CreatedAt = new Date();

    new_user.Password = await bcrypt.hash(createRootuserDto.Password, Number(process.env.SALT));
    new_user.StripeId = await this.paymentService.createCustomer(new_user);
    const user = await this.rootuserRepo.save(new_user);

    income_data.map(async (data) => {
      const income = new Income();
      income.IncomeSource = data.IncomeSource;
      income.Root = user;

      return await this.incomeRepo.save(income);
    });

    savings_data.map(async (data) => {
      const savings = new SavingsRetirement();
      savings.Category = SAV_RET_TYPE.SAVINGS;
      savings.Type = SAV_RET_TYPE.SAVINGS;
      savings.Description = data.Description;
      savings.Root = user;

      return await this.saveRetRep.save(savings);
    });

    retirements_data.map(async (data) => {
      const retirement = new SavingsRetirement();
      retirement.Category = SAV_RET_TYPE.RETIREMENTS;
      retirement.Type = SAV_RET_TYPE.RETIREMENTS;
      retirement.Description = data.Description;
      retirement.Root = user;

      return await this.saveRetRep.save(retirement);
    });

    debt_data.map(async (data) => {
      const debt = new Debt();
      debt.Description = data.description;
      debt.Category = data.Category;
      debt.Root = user;

      return await this.debtRepo.save(debt);
    });

    expenses_data.map(async (data) => {
      const expense = new Expense();
      expense.Owner = data.Owner;
      expense.Category = data.Category;
      expense.Description = data.Description;
      expense.Root = user;

      return await this.expenseRepo.save(expense);
    });

    Array.from({ length: 10 }).map(async () => {
      const new_pay = new ExtraPayCheck();

      new_pay.Root = user;

      return await this.payCheckRepo.save(new_pay);
    });

    goals_data.map(async (goal) => {
      const new_goal = new Goal();

      new_goal.Category = goal.Category;
      new_goal.Percentage = goal.Percentage;
      new_goal.Type = goal.Type;

      new_goal.Root = user;

      return await this.goalRepo.save(new_goal);
    });

    return user;
  }

  findAll() {
    return this.rootuserRepo.find({ where: { IsTrash: false } });
  }

  findOne(id: number) {
    return this.rootuserRepo.findOneBy({ id });
  }

  async update(id: number, updateRootuserDto: UpdateRootuserDto) {
    const new_user = await this.findOne(id);

    if (updateRootuserDto.FullName) new_user.FullName = updateRootuserDto.FullName;

    if (updateRootuserDto.SelfAge) new_user.SelfAge = updateRootuserDto.SelfAge;

    if (updateRootuserDto.PartnerAge) new_user.PartnerAge = updateRootuserDto.PartnerAge;

    if (updateRootuserDto.Email) new_user.Email = updateRootuserDto.Email;

    if (updateRootuserDto.Country) new_user.Country = updateRootuserDto.Country;

    if (updateRootuserDto.DateFormat) new_user.DateFormat = updateRootuserDto.DateFormat;

    if (updateRootuserDto.Currency) new_user.Currency = updateRootuserDto.Currency;

    if (updateRootuserDto.Separator) new_user.Separator = updateRootuserDto.Separator;

    if (updateRootuserDto.Status) new_user.Status = updateRootuserDto.Status;

    if (updateRootuserDto.FreeAccess !== undefined) new_user.FreeAccess = updateRootuserDto.FreeAccess;

    return this.rootuserRepo.save(new_user);
  }

  async updateStatus(id: number) {
    const new_user = await this.findOne(id);

    if (new_user.Status === Status.ACTIVE) {
      new_user.Status = Status.INACTIVE;
    } else {
      new_user.Status = Status.ACTIVE;
    }

    new_user.UpdatedAt = new Date();

    return this.rootuserRepo.save(new_user);
  }

  async updateFreeAccess(id: number) {
    const new_user = await this.findOne(id);

    if (new_user.FreeAccess) {
      new_user.FreeAccess = false;
    } else {
      new_user.FreeAccess = true;
    }

    return this.rootuserRepo.save(new_user);
  }

  async updateAutoRenewal(id: number, updateUserAutoRenewalDto: UpdateUserAutoRenewalDto) {
    const new_user = await this.findOne(id);

    new_user.Auto_Renewal = updateUserAutoRenewalDto.Auto_Renewal;

    return this.rootuserRepo.save(new_user);
  }

  remove(id: number) {
    return this.rootuserRepo.update(id, { IsTrash: true });
  }
}
