import { Global, Module } from '@nestjs/common';
import { PinpointService } from './pinpoint.service';

@Global()
@Module({
  controllers: [],
  providers: [PinpointService],
})
export class PinpointModule {}
