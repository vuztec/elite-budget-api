import { Global, Module } from '@nestjs/common';
import { CustomerServiceService } from './customer-service.service';
import { CustomerServiceController } from './customer-service.controller';
import { PinpointService } from '@/pinpoint/pinpoint.service';

@Global()
@Module({
  controllers: [CustomerServiceController],
  providers: [CustomerServiceService, PinpointService],
  exports: [CustomerServiceService],
})
export class CustomerServiceModule {}
