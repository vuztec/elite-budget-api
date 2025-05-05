import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OtpService } from './otp.service';
import { CreateOtpDto, VerifyOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('verify')
  verify(@Body() createOtpDto: VerifyOtpDto) {
    return this.otpService.verifyOtp(createOtpDto);
  }

  @Post('')
  createNew(@Body() createOtpDto: CreateOtpDto) {
    return this.otpService.create(createOtpDto);
  }

  @Get()
  getOtp(@Query('email') email: string) {
    return this.otpService.getOtp(email);
  }
}
