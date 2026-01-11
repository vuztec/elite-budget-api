import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomerServiceService } from './customer-service.service';
import { CustomerServiceDto } from './dto/customer-service.dto';

@ApiTags('Customer Service')
@Controller('customer-service')
export class CustomerServiceController {
  constructor(private readonly customerServiceService: CustomerServiceService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit customer service request' })
  @ApiResponse({
    status: 200,
    description: 'Customer service request submitted successfully',
    schema: {
      example: {
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon.',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async submitCustomerService(@Body() customerServiceDto: CustomerServiceDto) {
    return this.customerServiceService.submitCustomerService(customerServiceDto);
  }
}
