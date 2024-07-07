import { Module } from '@nestjs/common';
import { RootusersService } from './rootusers.service';
import { RootusersController } from './rootusers.controller';

@Module({
  controllers: [RootusersController],
  providers: [RootusersService],
})
export class RootusersModule {}
