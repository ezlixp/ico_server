import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { HealthStatus } from './health-status';
import { AppController } from '../core/app.controller';

@Controller('health')
export class HealthController extends AppController {
  @Get()
  checkHealth(@Res() res: Response) {
    res.status(HttpStatus.OK).send({ status: HealthStatus.Healthy });
  }
}
