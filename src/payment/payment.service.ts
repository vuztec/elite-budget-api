import { Injectable } from '@nestjs/common';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { PACKAGE, PLAN } from '@/shared/enums/enum';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { CreatePriceDto } from './dto/create-price.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(@InjectRepository(Rootuser) private readonly rootuserRepo: Repository<Rootuser>) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  // createPaymentDto: CreatePaymentDto
  create() {
    return this.stripe.paymentIntents.create({ amount: Math.round(7.99 * 12 * 100), currency: 'USD' });
  }

  async createCustomer(user: Rootuser) {
    const customer = await this.stripe.customers.create({ email: user.Email, name: user.FullName });
    return customer.id;
  }

  async addCustomerPaymentMethod(user: Rootuser, createPaymentDto: CreatePaymentMethodDto) {
    if (!user.StripeId) {
      user.StripeId = await this.createCustomer(user);
      await this.rootuserRepo.save(user);
    }

    await this.stripe.paymentMethods.attach(createPaymentDto.PaymentMethodId, { customer: user.StripeId });

    return this.stripe.customers.update(user.StripeId, {
      invoice_settings: {
        default_payment_method: createPaymentDto.PaymentMethodId,
      },
    });
  }

  createPrice(createPriceDto: CreatePriceDto) {
    return this.stripe.prices.create({
      currency: 'usd',
      unit_amount: Math.round(createPriceDto.Amount * 12 * 100),
      recurring: {
        interval: 'year',
      },
      product_data: {
        name: 'Yearly Subscription Plan',
      },
    });
  }

  createSubscription(user: Rootuser) {
    return this.stripe.subscriptions.create({
      customer: user.StripeId,
      items: [
        {
          price: 'price_1Pu860HgcKL7MevorPgq0uwn',
        },
      ],
    });
  }

  chargeCustomer(user: Rootuser, id: string) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(7.99 * 12 * 100), // Amount in the smallest currency unit, e.g., cents
      currency: 'USD',
      customer: user.StripeId,
      payment_method_types: ['card'],
      off_session: true, // Charges the customer without requiring them to be present
      confirm: true, // Automatically confirms the payment
      payment_method: id,
    });
  }

  async createInvoiceAndChargeCustomer(user: Rootuser) {
    // Create an invoice item

    // Create and finalize the invoice
    const invoice = await this.stripe.invoices.create({
      customer: user.StripeId,
      collection_method: 'charge_automatically', // Automatically charge the payment method on file
    });
    await this.stripe.invoiceItems.create({
      customer: user.StripeId,
      amount: Math.round(7.99 * 12 * 100), // Amount in cents
      currency: 'usd',
      description: 'Subscription renewal',
      invoice: invoice.id,
    });

    await this.stripe.invoices.finalizeInvoice(invoice.id);

    return this.stripe.invoices.pay(invoice.id);
  }

  async stripeWebhook(request, rawBody) {
    const sig = request.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      console.log(' Webhook secret --------- ', webhookSecret);
      console.log(' Webhook sig --------- ', sig);
      console.log(' Webhook raw --------- ', rawBody);
      console.log(' Webhook body --------- ', request.body);
      // const parsedBody = JSON.stringify(request.body, null, 2);
      const event = this.stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      // const event: Stripe.Event = body.data.object;

      console.log('Event ------- : ', event);

      switch (event.type) {
        case 'invoice.payment_failed':
          const invoice = event.data.object as Stripe.Invoice;
          console.log(`Payment failed for invoice: ${invoice.id}`);
          // Handle the payment failure (e.g., notify customer, retry, etc.)
          break;
        case 'invoice.paid':
          const invoicePaid = event.data.object as Stripe.Invoice;
          const user = await this.rootuserRepo.findOne({ where: { StripeId: invoicePaid.customer.toString() } });
          await this.update(user);
          console.log(`Payment paid for invoice : ${invoice.id}`);
          // Then define and call a function to handle the event invoice.paid
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      console.log('Error : ', err);
      return { error: `Webhook Error: ${err.message}` };
    }

    return { received: true };
  }

  findAll() {
    return `This action returns all payment`;
  }

  async findAllPaymentMethods(user: Rootuser) {
    if (!user.StripeId) {
      user.StripeId = await this.createCustomer(user);
      await this.rootuserRepo.save(user);
    }
    return this.stripe.customers.listPaymentMethods(user.StripeId);
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  async update(user: Rootuser) {
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
