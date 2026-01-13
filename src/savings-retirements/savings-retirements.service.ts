import { Injectable } from '@nestjs/common';
import { CreateSavingsRetirementDto } from './dto/create-savings-retirement.dto';
import { UpdateSavingsRetirementDto } from './dto/update-savings-retirement.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { PAYMENT_METHOD, SAV_RET_TYPE } from '@/shared/enums/enum';
import { SavingsRetirement } from './entities/savings-retirement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SavingsRetirementsService {
  constructor(@InjectRepository(SavingsRetirement) private readonly saveRetRep: Repository<SavingsRetirement>) {}

  create(createSavingsRetirementDto: CreateSavingsRetirementDto, user: Rootuser, type: SAV_RET_TYPE) {
    const new_sav_ret = new SavingsRetirement();

    new_sav_ret.Category = createSavingsRetirementDto.Category;
    new_sav_ret.Description = createSavingsRetirementDto.Description;
    new_sav_ret.DueDate = createSavingsRetirementDto.DueDate;
    new_sav_ret.MarketValue = createSavingsRetirementDto.MarketValue;
    new_sav_ret.MonthlyBudget = createSavingsRetirementDto.MonthlyBudget;
    new_sav_ret.Owner = createSavingsRetirementDto.Owner;
    new_sav_ret.PaymentMethod = createSavingsRetirementDto.PaymentMethod;
    new_sav_ret.NickName = createSavingsRetirementDto.NickName;
    new_sav_ret.Frequency = createSavingsRetirementDto.Frequency;

    new_sav_ret.Type = type;

    new_sav_ret.Root = user;

    return this.saveRetRep.save(new_sav_ret);
  }

  findAll(type: SAV_RET_TYPE, user: Rootuser) {
    return this.saveRetRep
      .createQueryBuilder('data')
      .where('data.rootid = :id', { id: user.id })
      .andWhere('data.Type = :type', { type })
      .getMany();
  }

  findOne(id: number) {
    return this.saveRetRep.findOne({ where: { id } });
  }

  async update(id: number, updateSavingsRetirementDto: UpdateSavingsRetirementDto) {
    const new_sav_ret = await this.saveRetRep.findOne({ where: { id } });

    new_sav_ret.DueDate = updateSavingsRetirementDto.DueDate;
    new_sav_ret.MarketValue = updateSavingsRetirementDto.MarketValue;
    new_sav_ret.MonthlyBudget = updateSavingsRetirementDto.MonthlyBudget;
    new_sav_ret.Owner = updateSavingsRetirementDto.Owner;
    new_sav_ret.PaymentMethod = updateSavingsRetirementDto.PaymentMethod;
    new_sav_ret.NickName = updateSavingsRetirementDto.NickName;

    if (updateSavingsRetirementDto.Description) new_sav_ret.Description = updateSavingsRetirementDto.Description;
    new_sav_ret.Frequency = updateSavingsRetirementDto.Frequency;

    return this.saveRetRep.save(new_sav_ret);
  }

  async remove(id: number) {
    const new_sav_ret = await this.saveRetRep.findOne({ where: { id } });

    new_sav_ret.DueDate = '01';
    new_sav_ret.MarketValue = null;
    new_sav_ret.MonthlyBudget = null;
    // new_sav_ret.Owner = updateSavingsRetirementDto.Owner;
    new_sav_ret.PaymentMethod = PAYMENT_METHOD.AUTO_DEBIT;
    new_sav_ret.NickName = '';

    return this.saveRetRep.save(new_sav_ret);
  }
}
