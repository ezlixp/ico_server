import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthStatus } from './health-status.enum';

@Module({
  imports: [HealthStatus],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}
