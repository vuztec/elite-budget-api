import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, SubscriptionService],
})
export class PaymentModule {}
