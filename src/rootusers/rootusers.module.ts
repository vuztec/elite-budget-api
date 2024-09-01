import { Global, Module } from '@nestjs/common';
import { RootusersService } from './rootusers.service';
import { RootusersController } from './rootusers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rootuser } from './entities/rootuser.entity';
import { PaymentService } from '@/payment/payment.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Rootuser])],
  controllers: [RootusersController],
  providers: [RootusersService, PaymentService],
  exports: [TypeOrmModule],
})
export class RootusersModule {}
