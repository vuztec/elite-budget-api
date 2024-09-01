import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RootusersService } from '@/rootusers/rootusers.service';
import { PaymentService } from '@/payment/payment.service';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, RootusersService, PaymentService],
})
export class AuthModule {}
