import { Injectable } from '@nestjs/common';
import { CreateJointSplitDto } from './dto/create-joint-split.dto';
import { UpdateJointSplitDto } from './dto/update-joint-split.dto';

@Injectable()
export class JointSplitService {
  create(createJointSplitDto: CreateJointSplitDto) {
    return 'This action adds a new jointSplit';
  }

  findAll() {
    return `This action returns all jointSplit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jointSplit`;
  }

  update(id: number, updateJointSplitDto: UpdateJointSplitDto) {
    return `This action updates a #${id} jointSplit`;
  }

  remove(id: number) {
    return `This action removes a #${id} jointSplit`;
  }
}
