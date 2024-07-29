import { Injectable } from '@nestjs/common';
import { CreateExtraFundsTrackerDto } from './dto/create-extra-funds-tracker.dto';
import { UpdateBalanceDto, UpdateExtraFundsTrackerDto } from './dto/update-extra-funds-tracker.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { ExtraFundsTracker } from './entities/extra-funds-tracker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExcessBalance } from './entities/excess-balance.entity';

@Injectable()
export class ExtraFundsTrackerService {
  constructor(
    @InjectRepository(ExtraFundsTracker) private readonly fundRepo: Repository<ExtraFundsTracker>,
    @InjectRepository(ExcessBalance) private readonly balanceRepo: Repository<ExcessBalance>,
  ) {}

  create(createExtraFundsTrackerDto: CreateExtraFundsTrackerDto, user: Rootuser) {
    const new_fund = new ExtraFundsTracker();

    new_fund.Amount = createExtraFundsTrackerDto.Amount;
    new_fund.Date = createExtraFundsTrackerDto.Date;
    new_fund.Description = createExtraFundsTrackerDto.Description;
    new_fund.Owner = createExtraFundsTrackerDto.Owner;
    new_fund.Type = createExtraFundsTrackerDto.Type;

    new_fund.Root = user;

    return this.fundRepo.save(new_fund);
  }

  findAll(user: Rootuser) {
    return this.fundRepo.createQueryBuilder('funds').where('funds.rootid = :id', { id: user.id }).getMany();
  }

  findOne(id: number) {
    return this.fundRepo.findOne({ where: { id } });
  }

  findBalance(id: number) {
    return this.balanceRepo.findOne({ where: { Root: { id } } });
  }

  async update(id: number, updateExtraFundsTrackerDto: UpdateExtraFundsTrackerDto) {
    const new_fund = await this.fundRepo.findOne({ where: { id } });

    new_fund.Amount = updateExtraFundsTrackerDto.Amount;
    new_fund.Date = updateExtraFundsTrackerDto.Date;
    new_fund.Description = updateExtraFundsTrackerDto.Description;
    new_fund.Owner = updateExtraFundsTrackerDto.Owner;
    new_fund.Type = updateExtraFundsTrackerDto.Type;

    return this.fundRepo.save(new_fund);
  }

  async updateBalance(updateBalance: UpdateBalanceDto, user: Rootuser) {
    let balance = await this.balanceRepo.findOne({ where: { Root: { id: user.id } } });

    if (!balance) balance = new ExcessBalance();

    balance.Balance = updateBalance.Balance;
    balance.Root = user;

    return this.balanceRepo.save(balance);
  }

  remove(id: number) {
    return this.fundRepo.delete(id);
  }
}
