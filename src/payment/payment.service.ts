import { Injectable } from '@nestjs/common';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { PACKAGE, PLAN } from '@/shared/enums/enum';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(@InjectRepository(Rootuser) private readonly rootuserRepo: Repository<Rootuser>) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  // createPaymentDto: CreatePaymentDto
  create() {
    return this.stripe.paymentIntents.create({ amount: 95, currency: 'USD' });
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  async update(updatePaymentDto: UpdatePaymentDto, user: Rootuser) {
    const new_user = await this.rootuserRepo.findOne({ where: { id: user.id } });

    new_user.Package = PACKAGE.PREMIUM;
    new_user.Payment = true;
    new_user.Plan = PLAN.YEARLY;
    new_user.SubscribeDate = new Date();
    new_user.IsExpired = false;

    return await this.rootuserRepo.save(new_user);
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
