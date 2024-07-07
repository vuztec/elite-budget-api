import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    try {
      // Healthcheck endpoint doesnt need any auth
      if (req.path.startsWith('/health')) {
        return next();
      }

      const token = req.headers.authorization;
      if (!token) {
        throw new UnauthorizedException('No token provided');
      } else if (token.startsWith('Bearer ')) {
        let payload = await this.jwtService.verifyAsync(token.split(' ')[1]);

        let user = await this.usersRepository
          .createQueryBuilder('user')
          .where('user.id = :id', { id: payload.id })
          .leftJoinAndSelect('user.Categories', 'Categories')
          .getOne();

        req['user'] = user;
        next();
      }
    } catch (error) {
      console.debug(error);
      throw new UnauthorizedException(error.message);
    }
  }
}
