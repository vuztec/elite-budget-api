import { Global, Module } from '@nestjs/common';
import { ExtraPayChecksService } from './extra-pay-checks.service';
import { ExtraPayChecksController } from './extra-pay-checks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraPayCheck } from './entities/extra-pay-check.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ExtraPayCheck])],
  controllers: [ExtraPayChecksController],
  providers: [ExtraPayChecksService],
  exports: [TypeOrmModule],
})
export class ExtraPayChecksModule {}
