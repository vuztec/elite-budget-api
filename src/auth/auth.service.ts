import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto, UpdatePasswordDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Rootuser) private userRepo: Repository<Rootuser>,
    private jwtService: JwtService,
  ) {}

  async login(AuthDto: CreateAuthDto) {
    const user = await this.userRepo.findOneBy({ Email: AuthDto.Email });

    if (!user) {
      throw new NotFoundException('User not found.'); // Or UnauthorizedException, based on your security policy
    }

    const isMatch = await bcrypt.compare(AuthDto.Password, user.Password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }

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

    return this.userRepo.save(user);
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
