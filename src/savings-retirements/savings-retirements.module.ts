import { Module } from '@nestjs/common';
import { SavingsRetirementsService } from './savings-retirements.service';
import { SavingsRetirementsController } from './savings-retirements.controller';

@Module({
  controllers: [SavingsRetirementsController],
  providers: [SavingsRetirementsService],
})
export class SavingsRetirementsModule {}
