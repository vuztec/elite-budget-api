import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Rootuser) private usersRepository: Repository<Rootuser>,
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
          .getOne();
        // Calculate trial period (15 days from JoinDate)

        if (
          req.path.startsWith('/api/auth/me') ||
          req.path.startsWith('/api/auth/password') ||
          req.path.startsWith('/api/rootusers/')
        ) {
          req['user'] = user;
          return next();
        }
        const currentDate = new Date();
        const trialEndDate = new Date(user.CreatedAt);
        trialEndDate.setDate(trialEndDate.getDate() + 14);

        // Check if the trial period is still active
        if (currentDate <= trialEndDate) {
          req['user'] = user;
          return next(); // Allow user during the trial period
        }

        // After trial period, check payment and expiration status
        if (!user.Payment || user.IsExpired) {
          // Subscription expired or payment not made, return empty array response
          return res.status(200).json([]);
        }

        req['user'] = user;
        next();
      }
    } catch (error) {
      console.debug(error);
      throw new UnauthorizedException(error.message);
    }
  }
}
