import { Module } from '@nestjs/common';
import { SavingsRetirementsService } from './savings-retirements.service';
import { SavingsRetirementsController } from './savings-retirements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingsRetirement } from './entities/savings-retirement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavingsRetirement])],
  controllers: [SavingsRetirementsController],
  providers: [SavingsRetirementsService],
})
export class SavingsRetirementsModule {}
