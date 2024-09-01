import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Rootuser)
    private readonly userRepository: Repository<Rootuser>,
  ) {}

  // This cron job runs every day at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSubscriptionCheck() {
    const today = new Date();

    // Find users with yearly plans that are not yet expired
    const users = await this.userRepository.find({
      where: {
        IsExpired: false,
      },
    });

    users.forEach(async (user) => {
      const oneYearLater = new Date(user.SubscribeDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      if (today >= oneYearLater) {
        user.IsExpired = true;
        user.Payment = false;

        await this.userRepository.save(user);
        console.log(`User id ${user.id} and ${user.FullName} subscription has expired.`);
      }
    });
  }
}
