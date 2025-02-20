import { HealthController } from '../../src/health/health.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthStatus } from '../../src/health/health-status';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = app.get<HealthController>(HealthController);
  });

  describe('getHealth', () => {
    it('should return HealthStatus.Healthy', () => {
      expect(controller.checkHealth()).toBe(HealthStatus.Healthy);
    });
  });
});
