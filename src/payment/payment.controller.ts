import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, RawBodyRequest } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { CreatePriceDto } from './dto/create-price.dto';
import { SubscriptionService } from './subscription.service';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post()
  create(@Req() req: Request & { user: Rootuser }, @Body() createPaymentDto: CreatePaymentDto) {
    const { user } = req;
    return this.paymentService.create(user, createPaymentDto.coupon);
  }

  @Post('payment-method')
  createPaymentMethod(
    @Req() req: Request & { user: Rootuser },
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ) {
    const { user } = req;
    return this.paymentService.addCustomerPaymentMethod(user, createPaymentMethodDto);
  }

  @Post('price')
  createPrice(@Body() createPriceDto: CreatePriceDto) {
    return this.paymentService.createPrice(createPriceDto);
  }

  @Post('subscription')
  createSubscription(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.paymentService.createSubscription(user);
  }

  @Post('charge/:id')
  chargeCustomer(@Req() req: Request & { user: Rootuser }, @Query('id') id: string) {
    const { user } = req;
    return this.paymentService.chargeCustomer(user, id);
  }

  @Post('webhook')
  stripeWebhook(@Req() request: Request, @Req() req: RawBodyRequest<Request>) {
    return this.paymentService.stripeWebhook(request, req.rawBody);
  }

  @Post('invoice')
  createInvoiceCharge(
    @Req() req: Request & { user: Rootuser },
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ) {
    const { user } = req;
    return this.paymentService.createInvoiceAndChargeCustomer(user, createPaymentMethodDto);
  }

  @Get()
  findAll(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.paymentService.findAll();
  }

  @Get('renew')
  checkSubscription() {
    return this.subscriptionService.handleSubscriptionCheck();
  }

  @Get('payment-methods')
  findAllPaymentMethods(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.paymentService.findAllPaymentMethods(user);
  }

  @Get('coupons')
  findAllCoupons() {
    return this.paymentService.findAllCoupons();
  }

  @Get('transactions')
  findAllTransactions(@Query('userId') userId?: string) {
    return this.paymentService.findAllTransactions(userId ? Number(userId) : undefined);
  }

  @Get('stripe/customers')
  findAllStripeCustomers() {
    return this.paymentService.findAllStripeCustomers();
  }

  @Get('stripe/customers/:id/transactions')
  findAllTransactionOfcustomer(@Param('id') id: string) {
    return this.paymentService.findAllTransactionOfcustomer(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.paymentService.findOne(+id);
  // }

  @Patch()
  update(@Body() updatePaymentDto: UpdatePaymentDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.paymentService.update(user);
  }

  @Patch('payment-method')
  updatePaymentMethod(@Body() UpdatePaymentDto: CreatePaymentMethodDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.paymentService.updatePaymentMethod(user, UpdatePaymentDto.PaymentMethodId);
  }

  @Delete('/payment-method/:id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }
}
