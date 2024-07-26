import { Injectable } from '@nestjs/common';
import { CreateExtraPayCheckDto } from './dto/create-extra-pay-check.dto';
import { UpdateExtraPayCheckDto } from './dto/update-extra-pay-check.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { ExtraPayCheck } from './entities/extra-pay-check.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExtraPayChecksService {
  constructor(@InjectRepository(ExtraPayCheck) private readonly payCheckRepo: Repository<ExtraPayCheck>) {}

  create(createExtraPayCheckDto: CreateExtraPayCheckDto, user: Rootuser) {
    const new_pay = new ExtraPayCheck();

    new_pay.PartnerAmount = createExtraPayCheckDto.PartnerAmount;
    new_pay.SelfAmount = createExtraPayCheckDto.SelfAmount;
    new_pay.Date = createExtraPayCheckDto.Date;

    new_pay.Root = user;

    return this.payCheckRepo.save(new_pay);
  }

  findAll(user: Rootuser) {
    return this.payCheckRepo.createQueryBuilder('pay').where('pay.rootid = :id', { id: user.id }).getMany();
  }

  findOne(id: number) {
    return this.payCheckRepo.findOne({ where: { id } });
  }

  async update(id: number, updateExtraPayCheckDto: UpdateExtraPayCheckDto) {
    const new_pay = await this.payCheckRepo.findOne({ where: { id } });

    new_pay.PartnerAmount = updateExtraPayCheckDto.PartnerAmount;
    new_pay.SelfAmount = updateExtraPayCheckDto.SelfAmount;
    new_pay.Date = updateExtraPayCheckDto.Date;

    return this.payCheckRepo.save(new_pay);
  }

  async remove(id: number) {
    const new_pay = await this.payCheckRepo.findOne({ where: { id } });

    new_pay.PartnerAmount = 0;
    new_pay.SelfAmount = 0;
    new_pay.Date = null;

    return this.payCheckRepo.save(new_pay);
  }
}
