import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income } from './entities/income.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';

@Injectable()
export class IncomeService {
  constructor(@InjectRepository(Income) private readonly incomeRepo: Repository<Income>) {}

  create(createIncomeDto: CreateIncomeDto, user: Rootuser) {
    const new_income = new Income();
    new_income.Frequency = createIncomeDto.Frequency;
    new_income.GrossAmount = createIncomeDto.GrossAmount;
    new_income.NetAmount = createIncomeDto.NetAmount;
    new_income.IncomeSource = createIncomeDto.IncomeSource;
    new_income.Owner = createIncomeDto.Owner;
    new_income.Root = user;

    return this.incomeRepo.save(new_income);
  }

  findAll(user: Rootuser) {
    return this.incomeRepo.createQueryBuilder('income').where('income.rootid = :id', { id: user.id }).getMany();
  }

  findOne(id: number) {
    return this.incomeRepo.findOne({ where: { id } });
  }

  async update(id: number, updateIncomeDto: UpdateIncomeDto) {
    const new_income = await this.incomeRepo.findOne({ where: { id } });
    new_income.Frequency = updateIncomeDto.Frequency;
    new_income.GrossAmount = updateIncomeDto.GrossAmount;
    new_income.NetAmount = updateIncomeDto.NetAmount;
    new_income.IncomeSource = updateIncomeDto.IncomeSource;
    new_income.Owner = updateIncomeDto.Owner;

    return this.incomeRepo.save(new_income);
  }

  remove(id: number) {
    return this.incomeRepo.delete(id);
  }
}
