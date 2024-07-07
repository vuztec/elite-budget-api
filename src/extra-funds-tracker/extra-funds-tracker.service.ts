import { Injectable } from '@nestjs/common';
import { CreateExtraFundsTrackerDto } from './dto/create-extra-funds-tracker.dto';
import { UpdateExtraFundsTrackerDto } from './dto/update-extra-funds-tracker.dto';

@Injectable()
export class ExtraFundsTrackerService {
  create(createExtraFundsTrackerDto: CreateExtraFundsTrackerDto) {
    return 'This action adds a new extraFundsTracker';
  }

  findAll() {
    return `This action returns all extraFundsTracker`;
  }

  findOne(id: number) {
    return `This action returns a #${id} extraFundsTracker`;
  }

  update(id: number, updateExtraFundsTrackerDto: UpdateExtraFundsTrackerDto) {
    return `This action updates a #${id} extraFundsTracker`;
  }

  remove(id: number) {
    return `This action removes a #${id} extraFundsTracker`;
  }
}
