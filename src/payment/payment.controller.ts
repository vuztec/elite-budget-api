import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create() {
    return this.paymentService.create();
  }

  // @Body() createPaymentDto: CreatePaymentDto

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch()
  update(@Body() updatePaymentDto: UpdatePaymentDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.paymentService.update(updatePaymentDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
