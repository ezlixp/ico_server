import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import { HealthModule } from './health/health.module';
import { API_VERSION } from './configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`api/v${API_VERSION}`);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
