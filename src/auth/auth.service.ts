import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ChangePasswordDto, ForgetPasswordDto, UpdateAuthDto, UpdatePasswordDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { Otp } from '@/otp/entities/otp.entity';
import { generateOtp } from '@/shared/utils/general';
import { generateOtpEmailHtml } from '@/pinpoint/templates/opt-email';
import { PinpointService } from '@/pinpoint/pinpoint.service';
import { Status } from '@/shared/enums/enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Rootuser) private userRepo: Repository<Rootuser>,
    @InjectRepository(Otp) private readonly otpRepos: Repository<Otp>,
    private pinpointService: PinpointService,
    private jwtService: JwtService,
  ) {}

  async login(AuthDto: CreateAuthDto) {
    const user = await this.userRepo.findOneBy({ Email: AuthDto.Email });

    if (!user) {
      throw new NotFoundException('User not found.'); // Or UnauthorizedException, based on your security policy
    }

    const isMatch = await bcrypt.compare(AuthDto.Password, user.Password);

    if (!isMatch) throw new UnauthorizedException('Invalid credentials.');

    if (user.Status === Status.INACTIVE) throw new ForbiddenException('User is inactive.');

    // Invalidate all unused OTPs for this email
    await this.otpRepos.update({ Email: user.Email, IsUsed: false }, { IsUsed: true });

    const code = generateOtp();

    const otp = this.otpRepos.create({
      Email: user.Email,
      Code: code,
      ExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
    });

    const html = generateOtpEmailHtml(code);

    await this.pinpointService.sendEmail(user.Email, html);

    return await this.otpRepos.save(otp);

    // const payload = {
    //   id: user.id,
    //   UserType: user.UserType,
    //   Email: user.Email,
    // };
    // const jwt = await this.jwtService.signAsync(payload);

    // return {
    //   user,
    //   jwt,
    // };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  findMe(user: Rootuser) {
    return user;
  }

  async updatePassword(updateUserDto: UpdatePasswordDto, logged: Rootuser) {
    const user = await this.userRepo.findOne({ where: { id: logged.id } });

    const isMatch = await bcrypt.compare(updateUserDto.CurrentPassword, user.Password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    user.Password = await bcrypt.hash(updateUserDto.NewPassword, Number(process.env.SALT));

    return await this.userRepo.save(user);
  }

  async forgetPassword(dt: ForgetPasswordDto) {
    const user = await this.userRepo.findOneBy({ Email: dt.Email });

    if (!user) {
      throw new NotFoundException('User not found.'); // Or UnauthorizedException, based on your security policy
    }

    // Invalidate all unused OTPs for this email
    await this.otpRepos.update({ Email: user.Email, IsUsed: false }, { IsUsed: true });

    const code = generateOtp();

    const otp = this.otpRepos.create({
      Email: user.Email,
      Code: code,
      ExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
    });

    const html = generateOtpEmailHtml(code);

    await this.pinpointService.sendEmail(user.Email, html);

    return await this.otpRepos.save(otp);
  }

  async resetPassword(updateUserDto: ChangePasswordDto) {
    const otp = await this.otpRepos.findOne({
      where: { id: updateUserDto.otpId },
    });

    if (!otp || !otp.IsUsed || otp.ExpiresAt < new Date()) {
      throw new UnauthorizedException('OTP verification required or expired.');
    }

    const user = await this.userRepo.findOne({ where: { Email: otp.Email } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    user.Password = await bcrypt.hash(updateUserDto.Password, Number(process.env.SALT));
    await this.userRepo.save(user);

    // Invalidate all other OTPs for that context
    await this.otpRepos.update({ Email: otp.Email, IsUsed: false }, { IsUsed: true });

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

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
