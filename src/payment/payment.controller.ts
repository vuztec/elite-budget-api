import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, RawBodyRequest } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { CreatePriceDto } from './dto/create-price.dto';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.paymentService.create();
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
  createInvoiceCharge(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.paymentService.createInvoiceAndChargeCustomer(user);
  }

  @Get()
  findAll(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.paymentService.findAll();
  }

  @Get('payment-methods')
  findAllPaymentMethods(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.paymentService.findAllPaymentMethods(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch()
  update(@Body() updatePaymentDto: UpdatePaymentDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.paymentService.update(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
