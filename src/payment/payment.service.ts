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

    // Check if the trial period is still active
    // if (createPaymentDto.isTrial) {
    //   const customer = await this.stripe.customers.update(user.StripeId, {
    //     invoice_settings: {
    //       default_payment_method: createPaymentDto.PaymentMethodId,
    //     },
    //   });
    //   // user.Payment = true;
    //   // user.IsExpired = false;
    //   user.Coupon = createPaymentDto.Coupon;
    //   user.CreatedAt = new Date();
    //   user.SubscribeDate = new Date();
    //   const updateduser = await this.rootuserRepo.save(user);

    //   return { customer, user: updateduser };
    // } else

    if (createPaymentDto.Coupon) {
      user.Coupon = createPaymentDto.Coupon;
      await this.rootuserRepo.save(user);
    }
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

  async createInvoiceAndChargeCustomer(user: Rootuser, dto?: CreatePaymentMethodDto) {
    // Create an invoice item
    const baseAmount = Math.round(7.99 * 12 * 100); // e.g., $95.88 in cents
    let discountAmount = 0;

    // Handle coupon manually
    if (dto?.Coupon) {
      try {
        const coupon = await this.stripe.coupons.retrieve(dto.Coupon);

        if (coupon.valid) {
          user.Coupon = dto.Coupon;
          await this.rootuserRepo.save(user);

          if (coupon.amount_off) {
            // Fixed amount discount
            discountAmount = coupon.amount_off;
          } else if (coupon.percent_off) {
            // Percentage discount
            discountAmount = Math.round(baseAmount * (coupon.percent_off / 100));
          }

          // Optional: clamp discount to not exceed baseAmount
          if (discountAmount > baseAmount) {
            discountAmount = baseAmount;
          }
        }
      } catch (error) {
        console.log('Error retrieving coupon: ', error);
      }
    } else if (user?.Coupon) {
      try {
        const coupon = await this.stripe.coupons.retrieve(user.Coupon);
        discountAmount = 0;
        if (coupon.valid) {
          user.Coupon = dto.Coupon;
          await this.rootuserRepo.save(user);

          if (coupon.amount_off) {
            // Fixed amount discount
            discountAmount = coupon.amount_off;
          } else if (coupon.percent_off) {
            // Percentage discount
            discountAmount = Math.round(baseAmount * (coupon.percent_off / 100));
          }

          // Optional: clamp discount to not exceed baseAmount
          if (discountAmount > baseAmount) {
            discountAmount = baseAmount;
          }
        }
      } catch (error) {
        console.log('Error retrieving coupon: ', error);
      }
    }

    const finalAmount = baseAmount - discountAmount;

    // Create and finalize the invoice
    const invoice = await this.stripe.invoices.create({
      customer: user.StripeId,
      collection_method: 'charge_automatically', // Automatically charge the payment method on file
    });

    await this.stripe.invoiceItems.create({
      customer: user.StripeId,
      amount: finalAmount, // Amount in cents
      currency: 'usd',
      description: `Subscription renewal for the email ${user.Email}`,
      invoice: invoice.id,
    });

    await this.stripe.invoices.finalizeInvoice(invoice.id);

    return this.stripe.invoices.pay(invoice.id, dto?.PaymentMethodId && { payment_method: dto?.PaymentMethodId });
  }

  async stripeWebhook(request: any, rawBody: any) {
    const sig = request.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      // const parsedBody = JSON.stringify(request.body, null, 2);
      const event = this.stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      // const event: Stripe.Event = body.data.object;

      switch (event.type) {
        case 'invoice.payment_failed':
          const invoiceFailed = event.data.object as Stripe.Invoice;
          console.log(`Payment failed for invoice: ${invoiceFailed.id}`);
          break;
        case 'invoice.paid':
          const invoicePaid = event.data.object as Stripe.Invoice;
          const user = await this.rootuserRepo.findOne({ where: { StripeId: invoicePaid.customer.toString() } });
          await this.update(user);
          console.log(`Payment paid for invoice : ${invoicePaid.id}`);
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

    if (user.StripeId) {
      const cards = await this.stripe.customers.listPaymentMethods(user.StripeId);
      const customer = await this.stripe.customers.retrieve(user.StripeId);

      return { cards: cards.data, customer };
    } else return [];
  }

  async findAllCoupons() {
    return this.stripe.coupons.list({ limit: 1000 });
  }

  async findAllStripeCustomers() {
    return (await this.stripe.customers.list({ limit: 1000 })).data;
  }

  async findAllTransactionOfcustomer(id: string) {
    return (
      await this.stripe.invoices.list({
        customer: id,
        limit: 1000,
      })
    ).data;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} payment`;
  // }

  async update(user: Rootuser) {
    // const new_user = await this.rootuserRepo.findOne({ where: { id: user.id } });

    user.Package = PACKAGE.PREMIUM;
    user.Payment = true;
    user.Plan = PLAN.YEARLY;
    user.SubscribeDate = new Date();
    user.IsExpired = false;

    return await this.rootuserRepo.save(user);
  }

  async updatePaymentMethod(user: Rootuser, PaymentMethodId: string) {
    return this.stripe.customers.update(user.StripeId, {
      invoice_settings: {
        default_payment_method: PaymentMethodId,
      },
    });
  }

  async expireUserPackage(user: Rootuser) {
    user.IsExpired = true;
    user.Payment = false;

    await this.rootuserRepo.save(user);
    console.log(`User ${user.Email} subscription has expired.`);
  }

  remove(id: string) {
    return this.stripe.paymentMethods.detach(id);
  }
}
