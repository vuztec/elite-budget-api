import { Module } from '@nestjs/common';
import { SavingsRetirementsService } from './savings_retirements.service';
import { SavingsRetirementsController } from './savings_retirements.controller';

@Module({
  controllers: [SavingsRetirementsController],
  providers: [SavingsRetirementsService],
})
export class SavingsRetirementsModule {}
