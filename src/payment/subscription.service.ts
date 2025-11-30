import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { PaymentService } from './payment.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Rootuser)
    private readonly userRepository: Repository<Rootuser>,
    private readonly paymentService: PaymentService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSubscriptionCheck() {
    const today = new Date();

    const users = await this.userRepository.find({
      where: {
        Payment: false,
        IsExpired: true,
        Auto_Renewal: true,
        IsTrash: false,
        FreeAccess: false,
        SubscribeDate: Not(IsNull()),
      },
    });

    users.forEach(async (user) => {
      const oneYearLater = new Date(user.SubscribeDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      oneYearLater.setDate(oneYearLater.getDate() - 1);

      const trialEndDate = new Date(user.SubscribeDate);
      trialEndDate.setDate(trialEndDate.getDate() + 13);

      const created_date = new Date(user.CreatedAt).toDateString();
      const subscribe_date = user?.SubscribeDate ? new Date(user.SubscribeDate).toDateString() : null;

      if (today >= oneYearLater || (user.SubscribeDate && created_date === subscribe_date && today >= trialEndDate)) {
        try {
          if (user.Auto_Renewal) {
            const invoice = await this.paymentService.createInvoiceAndChargeCustomer(user);

            console.log(`User id ${user.id} and ${user.FullName} subscription renewal attempted.`);
            if (invoice.status === 'paid') {
              await this.userRepository.update(user.id, {
                ConsecutivePaymentFailures: 0,
                LastPaymentFailureDate: null,
              });
              await this.paymentService.update(user);
              console.log(`User id ${user.id} and ${user.FullName} subscription renewal successful.`);
            } else {
              await this.handlePaymentFailure(user);
            }
          } else {
            await this.paymentService.expireUserPackage(user);
            console.log(`User id ${user.id} and ${user.FullName} subscription has expired.`);
          }
        } catch (error) {
          await this.handlePaymentFailure(user);
          console.log('Payment Error for user', user.id, ':', error);
        }
      }
    });
  }

  private async handlePaymentFailure(user: Rootuser): Promise<void> {
    const failureCount = (user.ConsecutivePaymentFailures || 0) + 1;
    const today = new Date();

    await this.userRepository.update(user.id, {
      ConsecutivePaymentFailures: failureCount,
      LastPaymentFailureDate: today,
    });

    if (failureCount >= 3) {
      await this.userRepository.update(user.id, {
        Auto_Renewal: false,
      });

      console.log(`User id ${user.id} (${user.FullName}) auto-renewal disabled due to 3 consecutive payment failures.`);

      await this.paymentService.expireUserPackage(user);
    } else {
      console.log(
        `User id ${user.id} (${user.FullName}) payment failure ${failureCount}/3. Auto-renewal still enabled.`,
      );

      await this.paymentService.expireUserPackage(user);
    }
  }

  async resetPaymentFailures(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      ConsecutivePaymentFailures: 0,
      LastPaymentFailureDate: null,
    });
    console.log(`Payment failure count reset for user ${userId}`);
  }

  async getUsersWithPaymentFailures(minFailures: number = 1): Promise<Rootuser[]> {
    return this.userRepository.find({
      where: {
        ConsecutivePaymentFailures: minFailures,
        Auto_Renewal: true,
      },
      order: {
        ConsecutivePaymentFailures: 'DESC',
        LastPaymentFailureDate: 'DESC',
      },
    });
  }
}
