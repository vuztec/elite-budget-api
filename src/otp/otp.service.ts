import { Injectable } from '@nestjs/common';
import { CreateOtpDto, VerifyOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { Repository } from 'typeorm';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { JwtService } from '@nestjs/jwt';
import { generateOtpEmailHtml } from '@/pinpoint/templates/opt-email';
import { generateOtp } from '@/shared/utils/general';
import { PinpointService } from '@/pinpoint/pinpoint.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp) private readonly otpRepos: Repository<Otp>,
    @InjectRepository(Rootuser) private userRepo: Repository<Rootuser>,
    private jwtService: JwtService,
    private pinpointService: PinpointService,
  ) {}

  async create(dto: CreateOtpDto) {
    await this.otpRepos.update({ Email: dto.Email, IsUsed: false }, { IsUsed: true });

    const code = generateOtp();

    const otp = this.otpRepos.create({
      Email: dto.Email,
      Code: code,
      ExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
    });

    const html = generateOtpEmailHtml(code);

    await this.pinpointService.sendEmail(dto.Email, html);

    return await this.otpRepos.save(otp);
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otp = await this.otpRepos.findOne({
      where: { Email: dto.Email, Code: dto.Code, IsUsed: false },
    });

    if (!otp) return false;

    const isExpired = otp.ExpiresAt < new Date();
    if (isExpired) return false;

    otp.IsUsed = true;
    await this.otpRepos.save(otp);

    if (dto.type === 'reset') return otp;

    const user = await this.userRepo.findOneBy({ Email: dto.Email });

    const payload = {
      id: user.id,
      UserType: user.UserType,
      Email: user.Email,
    };
    const jwt = await this.jwtService.signAsync(payload);

    return {
      user,
      jwt,
    };
  }

  async getOtp(email: string) {
    const otp = await this.otpRepos.findOne({
      where: { Email: email, IsUsed: false },
    });

    return otp;
  }
}
