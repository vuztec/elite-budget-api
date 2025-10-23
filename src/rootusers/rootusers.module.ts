import { Global, Module } from '@nestjs/common';
import { RootusersService } from './rootusers.service';
import { RootusersController } from './rootusers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rootuser } from './entities/rootuser.entity';
import { PaymentService } from '@/payment/payment.service';
import { AuditModule } from '@/audit/audit.module';
import { Audit } from '@/audit/entities/audit.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Rootuser, Audit]), AuditModule],
  controllers: [RootusersController],
  providers: [RootusersService, PaymentService],
  exports: [TypeOrmModule],
})
export class RootusersModule {}
