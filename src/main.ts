import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HealthModule } from './health/health.module';

async function bootstrap() {
  const app = await NestFactory.create(HealthModule);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
