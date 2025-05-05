import { Global, Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { PinpointService } from '@/pinpoint/pinpoint.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  controllers: [OtpController],
  providers: [OtpService, PinpointService],
  exports: [TypeOrmModule],
})
export class OtpModule {}
