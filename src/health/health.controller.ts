import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { HealthStatus } from './health-status.enum';

@Controller('health')
export class HealthController {
  @Get()
  checkHealth(@Res() res: Response) {
    res.status(HttpStatus.OK).send({ status: HealthStatus.Healthy });
  }
}
