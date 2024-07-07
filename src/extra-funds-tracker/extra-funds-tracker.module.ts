import { Module } from '@nestjs/common';
import { ExtraFundsTrackerService } from './extra-funds-tracker.service';
import { ExtraFundsTrackerController } from './extra-funds-tracker.controller';

@Module({
  controllers: [ExtraFundsTrackerController],
  providers: [ExtraFundsTrackerService],
})
export class ExtraFundsTrackerModule {}
