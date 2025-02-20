import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthStatus } from './health-status';
import { AppController } from '../core/app.controller';

@Controller('health')
export class HealthController extends AppController {
  @Get()
  @HttpCode(HttpStatus.OK)
  checkHealth(): HealthStatus {
    return HealthStatus.Healthy;
  }
}
