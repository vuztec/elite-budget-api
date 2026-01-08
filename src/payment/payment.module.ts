import { Global, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { SubscriptionService } from './subscription.service';
import { PinpointModule } from '@/pinpoint/pinpoint.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from './entities/payment.entity';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransaction, Rootuser]), PinpointModule],
  controllers: [PaymentController],
  providers: [PaymentService, SubscriptionService],
  exports: [PaymentService, TypeOrmModule],
})
export class PaymentModule {}
