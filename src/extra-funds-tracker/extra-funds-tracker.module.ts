import { Global, Module } from '@nestjs/common';
import { ExtraFundsTrackerService } from './extra-funds-tracker.service';
import { ExtraFundsTrackerController } from './extra-funds-tracker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraFundsTracker } from './entities/extra-funds-tracker.entity';
import { ExcessBalance } from './entities/excess-balance.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ExtraFundsTracker, ExcessBalance])],
  controllers: [ExtraFundsTrackerController],
  providers: [ExtraFundsTrackerService],
})
export class ExtraFundsTrackerModule {}
