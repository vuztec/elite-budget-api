import { Injectable } from '@nestjs/common';
import { CreateJointSplitDto } from './dto/create-joint-split.dto';
import { UpdateJointSplitDto } from './dto/update-joint-split.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JointSplit } from './entities/joint-split.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JointSplitService {
  constructor(@InjectRepository(JointSplit) private readonly jointSplitRepo: Repository<JointSplit>) {}

  create(createJointSplitDto: CreateJointSplitDto, user: Rootuser) {
    const new_joint = new JointSplit();

    new_joint.SelfAmount = createJointSplitDto.SelfAmount;
    new_joint.Root = user;

    return this.jointSplitRepo.save(new_joint);
  }

  findAll() {
    return this.jointSplitRepo.find({});
  }

  findOne(id: number) {
    return this.jointSplitRepo.findOne({ where: { id } });
  }

  async update(id: number, updateJointSplitDto: UpdateJointSplitDto) {
    const new_joint = await this.jointSplitRepo.findOne({ where: { id } });

    new_joint.SelfAmount = updateJointSplitDto.SelfAmount;

    return this.jointSplitRepo.save(new_joint);
  }

  remove(id: number) {
    return this.jointSplitRepo.delete(id);
  }
}
