import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async readiness() {
    return await this.health.check([
      async () => await this.db.pingCheck('database', { timeout: 1000 }),
    ]);
  }
  @Get('/provoke-error')
  async provokeError() {
    throw new Error('Provoked error');
  }
}
