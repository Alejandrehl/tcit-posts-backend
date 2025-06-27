import { HealthController } from '../health.controller';
import { HealthService } from '../health.service';

interface HealthCheckResult {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected';
    responseTime?: number;
    error?: string;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

describe('HealthController', () => {
  let controller: HealthController;
  let service: Partial<HealthService>;

  beforeEach(() => {
    service = {
      check: jest.fn(),
    };
    controller = new HealthController(service as HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return healthy status when service returns ok', async () => {
    const mockHealthResult: HealthCheckResult = {
      status: 'ok',
      timestamp: '2024-01-01T00:00:00.000Z',
      uptime: 123.456,
      database: {
        status: 'connected',
        responseTime: 15,
      },
      memory: {
        used: 45.2,
        total: 512,
        percentage: 8.8,
      },
    };

    (service.check as jest.Mock).mockResolvedValue(mockHealthResult);

    const result = (await controller.check()) as HealthCheckResult;

    expect(result).toEqual(mockHealthResult);
    expect(service.check).toHaveBeenCalled();
  });

  it('should return error status when service returns error', async () => {
    const mockHealthResult: HealthCheckResult = {
      status: 'error',
      timestamp: '2024-01-01T00:00:00.000Z',
      uptime: 123.456,
      database: {
        status: 'disconnected',
        error: 'Connection timeout',
      },
      memory: {
        used: 45.2,
        total: 512,
        percentage: 8.8,
      },
    };

    (service.check as jest.Mock).mockResolvedValue(mockHealthResult);

    const result = (await controller.check()) as HealthCheckResult;

    expect(result).toEqual(mockHealthResult);
    expect(service.check).toHaveBeenCalled();
  });
});
