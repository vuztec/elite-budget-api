import { Injectable } from '@nestjs/common';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { PACKAGE, PLAN } from '@/shared/enums/enum';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { CreatePriceDto } from './dto/create-price.dto';
import { PinpointService } from '@/pinpoint/pinpoint.service';
import { PaymentTransaction, PaymentStatus, PaymentType } from './entities/payment.entity';
import {
  invoiceEmailHtml,
  invoiceEmailSubject,
  InvoiceClient,
  InvoiceOrder,
  InvoiceCoupon,
} from '@/pinpoint/templates/customer-invoice-email';
import {
  orderNotifyEmailHtml,
  orderNotifySubject,
  NotifyClient,
  NotifyOrder,
  NotifyCoupon,
} from '@/pinpoint/templates/order-notify';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Rootuser) private readonly rootuserRepo: Repository<Rootuser>,
    @InjectRepository(PaymentTransaction) private readonly paymentTransactionRepo: Repository<PaymentTransaction>,
    private readonly pinpointService: PinpointService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async create(user: Rootuser, coupon?: string) {
    const baseAmount = Math.round(7.99 * 12 * 100); // $95.88 in cents
    let finalAmount = baseAmount;
    let appliedCoupon = null;

    if (coupon) {
      try {
        appliedCoupon = await this.stripe.coupons.retrieve(coupon);

        if (appliedCoupon.valid) {
          if (appliedCoupon.amount_off) {
            // Fixed amount discount
            finalAmount = Math.max(0, baseAmount - appliedCoupon.amount_off);
          } else if (appliedCoupon.percent_off) {
            // Percentage discount
            const discountAmount = Math.round((baseAmount * appliedCoupon.percent_off) / 100);
            finalAmount = Math.max(0, baseAmount - discountAmount);
          }
        }
      } catch (error) {
        console.log('Invalid coupon provided:', coupon);
        // Continue with base amount if coupon is invalid
      }
    }

    console.log(`Base Amount: ${baseAmount}, Final Amount after coupon: ${finalAmount}`);

    const paymentIntentData: any = {
      amount: finalAmount,
      currency: 'USD',
      metadata: {
        userId: user.id,
        email: user.Email,
        originalAmount: baseAmount.toString(),
        ...(appliedCoupon && {
          coupon: coupon,
          discountType: appliedCoupon.amount_off ? 'fixed' : 'percentage',
          discountValue: (appliedCoupon.amount_off || appliedCoupon.percent_off).toString(),
        }),
      },
    };

    const paymentIntent = await this.stripe.paymentIntents.create(paymentIntentData);

    return {
      client_secret: paymentIntent.client_secret,
      amount: finalAmount,
      originalAmount: baseAmount,
      appliedCoupon: appliedCoupon
        ? {
            id: appliedCoupon.id,
            name: appliedCoupon.name,
            amount_off: appliedCoupon.amount_off,
            percent_off: appliedCoupon.percent_off,
            valid: appliedCoupon.valid,
          }
        : null,
    };
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

    // if (createPaymentDto.Coupon) {
    //   user.Coupon = createPaymentDto.Coupon;
    //   await this.rootuserRepo.save(user);
    // }
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

    const userPaymentMethods = await this.stripe.customers.listPaymentMethods(user.StripeId, {
      type: 'card',
    });

    if (userPaymentMethods.data.length === 0 && !dto?.PaymentMethodId) {
      throw new Error('No payment method available for the customer.');
    }

    const baseAmount = Math.round(7.99 * 12 * 100); // e.g., $95.88 in cents
    let discountAmount = 0;
    let appliedCoupon = null;

    // Handle coupon manually
    if (dto?.Coupon) {
      try {
        appliedCoupon = await this.stripe.coupons.retrieve(dto.Coupon);

        if (appliedCoupon.valid) {
          user.Coupon = dto.Coupon;
          await this.rootuserRepo.save(user);

          if (appliedCoupon.amount_off) {
            // Fixed amount discount
            discountAmount = appliedCoupon.amount_off;
          } else if (appliedCoupon.percent_off) {
            // Percentage discount
            discountAmount = Math.round(baseAmount * (appliedCoupon.percent_off / 100));
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
        appliedCoupon = await this.stripe.coupons.retrieve(user.Coupon);
        discountAmount = 0;
        if (appliedCoupon.valid) {
          if (appliedCoupon.amount_off) {
            // Fixed amount discount
            discountAmount = appliedCoupon.amount_off;
          } else if (appliedCoupon.percent_off) {
            // Percentage discount
            discountAmount = Math.round(baseAmount * (appliedCoupon.percent_off / 100));
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
      metadata: {
        userId: user.id,
        email: user.Email,
        ...(appliedCoupon && {
          coupon: appliedCoupon.id,
          discountType: appliedCoupon.amount_off ? 'fixed' : 'percentage',
          discountValue: (appliedCoupon.amount_off || appliedCoupon.percent_off).toString(),
        }),
      },
    });

    await this.stripe.invoiceItems.create({
      customer: user.StripeId,
      amount: finalAmount, // Amount in cents
      currency: 'usd',
      description: `Subscription renewal for the email ${user.Email}`,
      invoice: invoice.id,
      metadata: {
        userId: user.id,
      },
    });

    await this.stripe.invoices.finalizeInvoice(invoice.id);

    return this.stripe.invoices.pay(invoice.id, dto?.PaymentMethodId && { payment_method: dto?.PaymentMethodId });
  }

  async stripeWebhook(request: any, rawBody: any) {
    const sig = request.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = this.stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

      switch (event.type) {
        case 'invoice.payment_failed':
          const invoiceFailed = event.data.object as Stripe.Invoice;
          console.log(`Payment failed for invoice: ${invoiceFailed.id}`);

          const invoiceFailedUser = await this.rootuserRepo.findOne({
            where: { StripeId: invoiceFailed.customer.toString() },
          });
          if (invoiceFailedUser) {
            await this.logFailedPayment(
              invoiceFailed.id,
              invoiceFailedUser,
              'Invoice payment failed',
              PaymentType.INVOICE,
              invoiceFailed.amount_due / 100,
            );
          }
          break;
        case 'invoice.paid':
          const invoicePaid = event.data.object as Stripe.Invoice;
          const user = await this.rootuserRepo.findOne({ where: { StripeId: invoicePaid.customer.toString() } });

          if (user) {
            const amountPaid = invoicePaid.amount_paid / 100;
            await this.update(user);
            console.log(`Payment paid for invoice: ${invoicePaid.id}, Amount: $${amountPaid}`);

            // Log transaction
            const transaction = await this.logInvoiceTransaction(invoicePaid, user, PaymentStatus.SUCCEEDED);

            // Send customer invoice email and admin notification
            await this.sendInvoiceEmails(invoicePaid, user);

            // Update transaction with email status
            await this.updateTransactionEmailStatus(transaction.id, true, true);
          } else {
            console.log(`⚠️  User not found for customer: ${invoicePaid.customer}`);
          }
          break;
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
          const userId = paymentIntent.metadata.userId;

          if (userId) {
            const amountReceived = paymentIntent.amount_received / 100;
            const user = await this.rootuserRepo.findOne({ where: { id: Number(userId) } });
            if (user) {
              await this.update(user, paymentIntent.metadata.coupon);
              console.log(`User ${user.Email} updated after successful payment intent.`);

              // Log transaction
              const transaction = await this.logPaymentIntentTransaction(paymentIntent, user, PaymentStatus.SUCCEEDED);

              // Send customer payment confirmation and admin notification
              await this.sendPaymentIntentEmails(paymentIntent, user);

              // Update transaction with email status
              await this.updateTransactionEmailStatus(transaction.id, true, true);
            }
          }
          break;
        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`PaymentIntent failed: ${failedPaymentIntent.id}`);

          const failedUserId = failedPaymentIntent.metadata?.userId;
          if (failedUserId) {
            const failedUser = await this.rootuserRepo.findOne({ where: { id: Number(failedUserId) } });
            if (failedUser) {
              await this.logFailedPayment(
                failedPaymentIntent.id,
                failedUser,
                failedPaymentIntent.last_payment_error?.message || 'Payment failed',
                PaymentType.ONE_TIME,
                failedPaymentIntent.amount / 100,
              );
            }
          }
          break;

        case 'charge.refunded':
          const refundedCharge = event.data.object as Stripe.Charge;
          console.log(`Charge refunded: ${refundedCharge.id}`);

          // Find user by customer ID and update their status
          if (refundedCharge.customer) {
            const refundedUser = await this.rootuserRepo.findOne({
              where: { StripeId: refundedCharge.customer.toString() },
            });

            if (refundedUser) {
              refundedUser.IsExpired = true;
              refundedUser.Payment = false;
              await this.rootuserRepo.save(refundedUser);
              console.log(`User ${refundedUser.Email} status updated after refund.`);

              // Find existing transaction and update with refund info
              const existingTransaction = await this.paymentTransactionRepo.findOne({
                where: { StripeChargeId: refundedCharge.id },
              });

              if (existingTransaction) {
                existingTransaction.Status = PaymentStatus.REFUNDED;
                existingTransaction.RefundedAt = new Date();
                existingTransaction.RefundAmount = refundedCharge.amount_refunded / 100;
                existingTransaction.Notes = 'Payment refunded by admin or customer request';
                await this.paymentTransactionRepo.save(existingTransaction);
              }
            }
          }
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
    const coupons = await this.stripe.coupons.list({ limit: 1000 });

    // Filter to only return valid coupons
    const validCoupons = coupons.data.filter((coupon) => coupon.valid);

    return {
      ...coupons,
      data: validCoupons,
    };
  }

  async findAllTransactions(userId?: number) {
    const query: any = {};

    if (userId) {
      query.where = { UserId: userId };
    }

    const transactions = await this.paymentTransactionRepo.find({
      ...query,
      relations: ['User'],
      order: {
        CreatedAt: 'DESC',
      },
    });

    return transactions;
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

  async update(user: Rootuser, coupon?: string) {
    user.Package = PACKAGE.PREMIUM;
    user.Payment = true;
    user.Plan = PLAN.YEARLY;
    user.SubscribeDate = new Date();
    user.IsExpired = false;

    if (coupon) user.Coupon = coupon;

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

  /**
   * Map Stripe invoice to customer email data
   */
  private mapInvoiceToCustomerEmail(
    invoice: Stripe.Invoice,
    user: Rootuser,
  ): { client: InvoiceClient; order: InvoiceOrder } {
    const client: InvoiceClient = {
      fullName: invoice.customer_name || user.FullName,
      email: invoice.customer_email || user.Email,
      billingAddressLine1: invoice.customer_address?.line1 || null,
      billingAddressLine2: invoice.customer_address?.line2 || null,
      billingCity: invoice.customer_address?.city || null,
      billingState: invoice.customer_address?.state || null,
      billingPostalCode: invoice.customer_address?.postal_code || null,
      billingCountry: invoice.customer_address?.country || null,
    };

    // Extract coupon info from invoice discount or user coupon
    let coupon: InvoiceCoupon = null;
    if (invoice.discount && invoice.discount.coupon) {
      const stripeCoupon = invoice.discount.coupon;
      if (stripeCoupon.amount_off) {
        coupon = {
          code: stripeCoupon.name || stripeCoupon.id,
          amountOff: stripeCoupon.amount_off / 100, // Convert cents to dollars
        };
      } else if (stripeCoupon.percent_off) {
        coupon = {
          code: stripeCoupon.name || stripeCoupon.id,
          percentOff: stripeCoupon.percent_off,
        };
      }
    } else if (user.Coupon) {
      // Fallback to user's stored coupon
      try {
        const retrievedCoupon = this.stripe.coupons.retrieve(user.Coupon);
        // Note: This is async but we'll handle it in the calling function
      } catch (error) {
        console.log('Could not retrieve user coupon:', error);
      }
    }

    const order: InvoiceOrder = {
      invoiceNumber: invoice.number || invoice.id,
      issuedAt: new Date(invoice.created * 1000),
      dueAt: invoice.due_date ? new Date(invoice.due_date * 1000) : new Date(invoice.created * 1000),
      subtotal: invoice.subtotal / 100, // Convert cents to dollars
      currency: invoice.currency.toUpperCase(),
      taxAmount: invoice.tax ? invoice.tax / 100 : 0,
      coupon,
      subscriptionName: 'Elite Budget App Subscription',
      periodLabel: null, // Could calculate based on subscription period
    };

    return { client, order };
  }

  /**
   * Map Stripe invoice to admin notification data
   */
  private mapInvoiceToAdminNotify(
    invoice: Stripe.Invoice,
    user: Rootuser,
  ): { client: NotifyClient; order: NotifyOrder } {
    const client: NotifyClient = {
      fullName: invoice.customer_name || user.FullName,
      email: invoice.customer_email || user.Email,
      telephone: user.Contact || null,
      company: null,
    };

    // Extract coupon info
    let coupon: NotifyCoupon = null;
    if (invoice.discount && invoice.discount.coupon) {
      const stripeCoupon = invoice.discount.coupon;
      if (stripeCoupon.amount_off) {
        coupon = {
          code: stripeCoupon.name || stripeCoupon.id,
          amountOff: stripeCoupon.amount_off / 100,
        };
      } else if (stripeCoupon.percent_off) {
        coupon = {
          code: stripeCoupon.name || stripeCoupon.id,
          percentOff: stripeCoupon.percent_off,
        };
      }
    }

    const order: NotifyOrder = {
      id: invoice.id,
      invoiceNumber: invoice.number || invoice.id,
      createdAt: new Date(invoice.created * 1000),
      currency: invoice.currency.toUpperCase(),
      subtotal: invoice.subtotal / 100,
      taxAmount: invoice.tax ? invoice.tax / 100 : 0,
      coupon,
      subscriptionName: 'Elite Budget App Subscription',
      paymentProvider: 'Stripe',
      paymentStatus: invoice.status,
      payUrl: invoice.hosted_invoice_url || null,
    };

    return { client, order };
  }

  /**
   * Create transaction log for successful PaymentIntent
   */
  private async logPaymentIntentTransaction(
    paymentIntent: Stripe.PaymentIntent,
    user: Rootuser,
    status: PaymentStatus,
  ): Promise<PaymentTransaction> {
    const billingDetails = paymentIntent.latest_charge
      ? await this.stripe.charges
          .retrieve(
            typeof paymentIntent.latest_charge === 'string'
              ? paymentIntent.latest_charge
              : paymentIntent.latest_charge.id,
          )
          .then((charge) => charge.billing_details)
      : null;

    const paymentMethod = paymentIntent.payment_method
      ? await this.stripe.paymentMethods.retrieve(
          typeof paymentIntent.payment_method === 'string'
            ? paymentIntent.payment_method
            : paymentIntent.payment_method.id,
        )
      : null;

    const transaction = this.paymentTransactionRepo.create({
      StripePaymentId: paymentIntent.id,
      StripeChargeId: paymentIntent.latest_charge
        ? typeof paymentIntent.latest_charge === 'string'
          ? paymentIntent.latest_charge
          : paymentIntent.latest_charge.id
        : null,
      User: user,
      CustomerEmail: user.Email,
      PaymentType: PaymentType.ONE_TIME,
      Status: status,
      Amount: paymentIntent.amount_received / 100,
      OriginalAmount: Number(paymentIntent.metadata?.originalAmount || paymentIntent.amount) / 100,
      Currency: paymentIntent.currency.toUpperCase(),
      CouponCode: paymentIntent.metadata?.coupon || null,
      DiscountType: paymentIntent.metadata?.discountType || null,
      DiscountValue: paymentIntent.metadata?.discountValue ? Number(paymentIntent.metadata.discountValue) / 100 : null,
      PaymentMethod: paymentMethod?.type || null,
      CardBrand: paymentMethod?.card?.brand || null,
      CardLast4: paymentMethod?.card?.last4 || null,
      BillingAddress: billingDetails?.address ? JSON.stringify(billingDetails.address) : null,
      StripeMetadata: JSON.stringify(paymentIntent.metadata),
      Description: `Subscription payment via PaymentIntent`,
      EmailSent: false,
      AdminNotified: false,
    });

    return await this.paymentTransactionRepo.save(transaction);
  }

  /**
   * Create transaction log for Invoice payment
   */
  private async logInvoiceTransaction(
    invoice: Stripe.Invoice,
    user: Rootuser,
    status: PaymentStatus,
  ): Promise<PaymentTransaction> {
    const transaction = this.paymentTransactionRepo.create({
      StripePaymentId: invoice.payment_intent
        ? typeof invoice.payment_intent === 'string'
          ? invoice.payment_intent
          : invoice.payment_intent.id
        : invoice.id,
      StripeChargeId: invoice.charge ? (typeof invoice.charge === 'string' ? invoice.charge : invoice.charge.id) : null,
      StripeInvoiceId: invoice.id,
      User: user,
      CustomerEmail: user.Email,
      PaymentType: PaymentType.INVOICE,
      Status: status,
      Amount: invoice.amount_paid / 100,
      OriginalAmount: invoice.subtotal / 100,
      Currency: invoice.currency.toUpperCase(),
      CouponCode: invoice.discount?.coupon?.id || user.Coupon || null,
      DiscountType: invoice.discount?.coupon?.amount_off
        ? 'fixed'
        : invoice.discount?.coupon?.percent_off
          ? 'percentage'
          : null,
      DiscountValue: invoice.discount?.coupon?.amount_off
        ? invoice.discount.coupon.amount_off / 100
        : invoice.discount?.coupon?.percent_off || null,
      PaymentMethod: invoice.collection_method || null,
      BillingAddress: invoice.customer_address ? JSON.stringify(invoice.customer_address) : null,
      StripeMetadata: JSON.stringify(invoice.metadata),
      Description: `Subscription renewal via Invoice ${invoice.number || invoice.id}`,
      EmailSent: false,
      AdminNotified: false,
    });

    return await this.paymentTransactionRepo.save(transaction);
  }

  /**
   * Update transaction log after sending emails
   */
  private async updateTransactionEmailStatus(
    transactionId: number,
    emailSent: boolean,
    adminNotified: boolean,
  ): Promise<void> {
    await this.paymentTransactionRepo.update(transactionId, {
      EmailSent: emailSent,
      AdminNotified: adminNotified,
    });
  }

  /**
   * Log failed payment
   */
  private async logFailedPayment(
    stripeId: string,
    user: Rootuser,
    failureReason: string,
    paymentType: PaymentType,
    amount?: number,
  ): Promise<PaymentTransaction> {
    const transaction = this.paymentTransactionRepo.create({
      StripePaymentId: stripeId,
      User: user,
      CustomerEmail: user.Email,
      PaymentType: paymentType,
      Status: PaymentStatus.FAILED,
      Amount: amount || 0,
      Currency: 'USD',
      FailureReason: failureReason,
      Description: `Payment failed: ${failureReason}`,
      EmailSent: false,
      AdminNotified: false,
    });

    return await this.paymentTransactionRepo.save(transaction);
  }

  /**
   * Send customer invoice email and admin notification
   */
  private async sendInvoiceEmails(invoice: Stripe.Invoice, user: Rootuser): Promise<void> {
    try {
      // Send customer invoice email
      const customerEmailData = this.mapInvoiceToCustomerEmail(invoice, user);
      const customerHtml = invoiceEmailHtml(customerEmailData.client, customerEmailData.order);
      const customerSubject = invoiceEmailSubject(customerEmailData.order);

      await this.pinpointService.sendEmail(
        user.Email,
        customerHtml,
        customerSubject,
        'Thank you for your payment. Please find your invoice details above.',
      );

      console.log(`✅ Customer invoice email sent to ${user.Email}`);

      // Send admin notification email
      const adminEmail = 'michelle@elitecashflowconsulting.com';
      if (adminEmail) {
        const adminEmailData = this.mapInvoiceToAdminNotify(invoice, user);
        const adminHtml = orderNotifyEmailHtml(adminEmailData.client, adminEmailData.order);
        const adminSubject = orderNotifySubject(adminEmailData.order);

        // Handle multiple admin emails if comma-separated

        await this.pinpointService.sendEmail(
          adminEmail,
          adminHtml,
          adminSubject,
          `New subscription order from ${user.FullName} (${user.Email})`,
        );

        console.log(`✅ Admin notification email sent to ${adminEmail}`);
      } else {
        console.log('⚠️  ADMIN_EMAIL not configured, skipping admin notification');
      }
    } catch (error) {
      console.error('❌ Error sending invoice emails:', error);
      // Don't throw - we don't want email failures to break payment processing
    }
  }

  /**
   * Map Stripe PaymentIntent to customer email data
   */
  private async mapPaymentIntentToCustomerEmail(
    paymentIntent: Stripe.PaymentIntent,
    user: Rootuser,
  ): Promise<{ client: InvoiceClient; order: InvoiceOrder }> {
    // Get billing details from the latest charge
    let billingDetails = null;
    if (paymentIntent.latest_charge) {
      const chargeId =
        typeof paymentIntent.latest_charge === 'string' ? paymentIntent.latest_charge : paymentIntent.latest_charge.id;
      const charge = await this.stripe.charges.retrieve(chargeId);
      billingDetails = charge.billing_details;
    }

    const client: InvoiceClient = {
      fullName: billingDetails?.name || user.FullName,
      email: billingDetails?.email || user.Email,
      billingAddressLine1: billingDetails?.address?.line1 || null,
      billingAddressLine2: billingDetails?.address?.line2 || null,
      billingCity: billingDetails?.address?.city || null,
      billingState: billingDetails?.address?.state || null,
      billingPostalCode: billingDetails?.address?.postal_code || null,
      billingCountry: billingDetails?.address?.country || null,
    };

    // Extract coupon info from metadata
    let coupon: InvoiceCoupon = null;
    if (paymentIntent.metadata?.coupon) {
      const couponCode = paymentIntent.metadata.coupon;
      const discountValue = Number(paymentIntent.metadata.discountValue);
      const discountType = paymentIntent.metadata.discountType;

      if (discountType === 'fixed') {
        coupon = {
          code: couponCode,
          amountOff: discountValue / 100, // Convert cents to dollars
        };
      } else if (discountType === 'percentage') {
        coupon = {
          code: couponCode,
          percentOff: discountValue,
        };
      }
    }

    const originalAmount = Number(paymentIntent.metadata?.originalAmount || paymentIntent.amount);

    const order: InvoiceOrder = {
      invoiceNumber: paymentIntent.id, // Use payment intent ID as invoice number
      issuedAt: new Date(paymentIntent.created * 1000),
      dueAt: new Date(paymentIntent.created * 1000),
      subtotal: originalAmount / 100, // Convert cents to dollars
      currency: paymentIntent.currency.toUpperCase(),
      taxAmount: 0, // PaymentIntent doesn't have tax info
      coupon,
      subscriptionName: 'Elite Budget App Subscription',
      periodLabel: null,
    };

    return { client, order };
  }

  /**
   * Map Stripe PaymentIntent to admin notification data
   */
  private async mapPaymentIntentToAdminNotify(
    paymentIntent: Stripe.PaymentIntent,
    user: Rootuser,
  ): Promise<{ client: NotifyClient; order: NotifyOrder }> {
    // Get billing details from the latest charge
    let billingDetails = null;
    if (paymentIntent.latest_charge) {
      const chargeId =
        typeof paymentIntent.latest_charge === 'string' ? paymentIntent.latest_charge : paymentIntent.latest_charge.id;
      const charge = await this.stripe.charges.retrieve(chargeId);
      billingDetails = charge.billing_details;
    }

    const client: NotifyClient = {
      fullName: billingDetails?.name || user.FullName,
      email: billingDetails?.email || user.Email,
      telephone: user.Contact || null,
      company: null,
    };

    // Extract coupon info from metadata
    let coupon: NotifyCoupon = null;
    if (paymentIntent.metadata?.coupon) {
      const couponCode = paymentIntent.metadata.coupon;
      const discountValue = Number(paymentIntent.metadata.discountValue);
      const discountType = paymentIntent.metadata.discountType;

      if (discountType === 'fixed') {
        coupon = {
          code: couponCode,
          amountOff: discountValue / 100,
        };
      } else if (discountType === 'percentage') {
        coupon = {
          code: couponCode,
          percentOff: discountValue,
        };
      }
    }

    const originalAmount = Number(paymentIntent.metadata?.originalAmount || paymentIntent.amount);

    const order: NotifyOrder = {
      id: paymentIntent.id,
      invoiceNumber: paymentIntent.id,
      createdAt: new Date(paymentIntent.created * 1000),
      currency: paymentIntent.currency.toUpperCase(),
      subtotal: originalAmount / 100,
      taxAmount: 0,
      coupon,
      subscriptionName: 'Elite Budget App Subscription',
      paymentProvider: 'Stripe',
      paymentStatus: paymentIntent.status,
      payUrl: null,
    };

    return { client, order };
  }

  /**
   * Send customer payment confirmation and admin notification for PaymentIntent
   */
  private async sendPaymentIntentEmails(paymentIntent: Stripe.PaymentIntent, user: Rootuser): Promise<void> {
    try {
      // Send customer invoice email
      const customerEmailData = await this.mapPaymentIntentToCustomerEmail(paymentIntent, user);
      const customerHtml = invoiceEmailHtml(customerEmailData.client, customerEmailData.order);
      const customerSubject = invoiceEmailSubject(customerEmailData.order);

      await this.pinpointService.sendEmail(
        user.Email,
        customerHtml,
        customerSubject,
        'Thank you for your payment. Please find your payment details above.',
      );

      console.log(`✅ Customer payment confirmation email sent to ${user.Email}`);

      // Send admin notification email
      const adminEmail = 'michelle@elitecashflowconsulting.com';
      if (adminEmail) {
        const adminEmailData = await this.mapPaymentIntentToAdminNotify(paymentIntent, user);
        const adminHtml = orderNotifyEmailHtml(adminEmailData.client, adminEmailData.order);
        const adminSubject = orderNotifySubject(adminEmailData.order);

        await this.pinpointService.sendEmail(
          adminEmail,
          adminHtml,
          adminSubject,
          `New subscription payment from ${user.FullName} (${user.Email})`,
        );

        console.log(`✅ Admin notification email sent to ${adminEmail}`);
      } else {
        console.log('⚠️  ADMIN_EMAIL not configured, skipping admin notification');
      }
    } catch (error) {
      console.error('❌ Error sending payment intent emails:', error);
      // Don't throw - we don't want email failures to break payment processing
    }
  }
}
