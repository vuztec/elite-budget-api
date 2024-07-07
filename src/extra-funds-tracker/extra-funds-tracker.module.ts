import { Module } from '@nestjs/common';
import { ExtraFundsTrackerService } from './extra-funds-tracker.service';
import { ExtraFundsTrackerController } from './extra-funds-tracker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraFundsTracker } from './entities/extra-funds-tracker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExtraFundsTracker])],
  controllers: [ExtraFundsTrackerController],
  providers: [ExtraFundsTrackerService],
})
export class ExtraFundsTrackerModule {}
