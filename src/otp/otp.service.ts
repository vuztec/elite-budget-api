import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { Repository } from 'typeorm';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp) private readonly otpRepos: Repository<Otp>,
    @InjectRepository(Rootuser) private userRepo: Repository<Rootuser>,
    private jwtService: JwtService,
  ) {}

  async verifyOtp(dto: UpdateOtpDto) {
    const otp = await this.otpRepos.findOne({
      where: { Email: dto.Email, Code: dto.Code, IsUsed: false },
    });

    if (!otp) return false;

    const isExpired = otp.ExpiresAt < new Date();
    if (isExpired) return false;

    otp.IsUsed = true;
    await this.otpRepos.save(otp);

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
}
