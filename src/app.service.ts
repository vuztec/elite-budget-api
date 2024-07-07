import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'success',
      message: 'Elite Budget',
      version: '1.0.0',
    };
  }
}
