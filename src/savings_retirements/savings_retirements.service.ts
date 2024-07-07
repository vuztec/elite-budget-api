import { Injectable } from '@nestjs/common';
import { CreateSavingsRetirementDto } from './dto/create-savings_retirement.dto';
import { UpdateSavingsRetirementDto } from './dto/update-savings_retirement.dto';

@Injectable()
export class SavingsRetirementsService {
  create(createSavingsRetirementDto: CreateSavingsRetirementDto) {
    return 'This action adds a new savingsRetirement';
  }

  findAll() {
    return `This action returns all savingsRetirements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} savingsRetirement`;
  }

  update(id: number, updateSavingsRetirementDto: UpdateSavingsRetirementDto) {
    return `This action updates a #${id} savingsRetirement`;
  }

  remove(id: number) {
    return `This action removes a #${id} savingsRetirement`;
  }
}
