import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income } from './entities/income.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { Frequency } from '@/shared/enums/enum';

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
    new_income.NickName = createIncomeDto.NickName;

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
    new_income.Owner = updateIncomeDto.Owner;
    new_income.NickName = updateIncomeDto.NickName;

    return this.incomeRepo.save(new_income);
  }

  async remove(id: number) {
    const new_income = await this.incomeRepo.findOne({ where: { id } });
    new_income.Frequency = Frequency.MONTHLY;
    new_income.GrossAmount = 0;
    new_income.NetAmount = 0;
    new_income.NickName = '';

    return this.incomeRepo.save(new_income);
  }
}
