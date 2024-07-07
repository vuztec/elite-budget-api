import { Global, Module } from '@nestjs/common';
import { RootusersService } from './rootusers.service';
import { RootusersController } from './rootusers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rootuser } from './entities/rootuser.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Rootuser])],
  controllers: [RootusersController],
  providers: [RootusersService],
  exports: [TypeOrmModule],
})
export class RootusersModule {}
