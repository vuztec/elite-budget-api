import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentService } from './payment.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Rootuser)
    private readonly userRepository: Repository<Rootuser>,
    private readonly paymentService: PaymentService,
  ) {}

  // This cron job runs every day at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSubscriptionCheck() {
    const today = new Date();

    // Find users with yearly plans that are not yet expired
    const users = await this.userRepository.find({
      where: {
        IsExpired: true,
        Auto_Renewal: true,
      },
    });

    users.forEach(async (user) => {
      const oneYearLater = new Date(user.SubscribeDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      const trialEndDate = new Date(user.CreatedAt);
      trialEndDate.setDate(trialEndDate.getDate() + 14);

      const created_date = new Date(user.CreatedAt).toDateString();
      const subscribe_date = user?.SubscribeDate ? new Date(user.SubscribeDate).toDateString() : null;

      if (today >= oneYearLater || (user.SubscribeDate && created_date === subscribe_date && today >= trialEndDate)) {
        try {
          if (user.Auto_Renewal) {
            const invoice = await this.paymentService.createInvoiceAndChargeCustomer(user);

            console.log(`User id ${user.id} and ${user.FullName} subscription renewal attempted.`);
            if (invoice.status === 'paid') await this.paymentService.update(user);
            else {
              await this.paymentService.expireUserPackage(user);
            }
          } else {
            await this.paymentService.expireUserPackage(user);
            console.log(`User id ${user.id} and ${user.FullName} subscription has expired.`);
          }
        } catch (error) {
          await this.paymentService.expireUserPackage(user);
          console.log('Error : ', error);
        }
      }
    });
  }
}
