import { HealthService } from '../health.service';
import { DataSource } from 'typeorm';

describe('HealthService', () => {
  let service: HealthService;
  let mockDataSource: Partial<DataSource>;

  beforeEach(() => {
    mockDataSource = {
      query: jest.fn(),
    };
    service = new HealthService(mockDataSource as DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return healthy status when database is connected', async () => {
    (mockDataSource.query as jest.Mock).mockResolvedValue([{ '?column?': 1 }]);

    const result = await service.check();

    expect(result.status).toBe('ok');
    expect(result.database.status).toBe('connected');
    expect(result.database.responseTime).toBeDefined();
    expect(typeof result.database.responseTime).toBe('number');
    expect(result.database.responseTime).toBeGreaterThanOrEqual(0);
    expect(result.memory).toBeDefined();
    expect(result.memory.used).toBeGreaterThan(0);
    expect(result.memory.total).toBeGreaterThan(0);
    expect(result.memory.percentage).toBeGreaterThan(0);
    expect(result.timestamp).toBeDefined();
    expect(result.uptime).toBeGreaterThan(0);
    expect(mockDataSource.query).toHaveBeenCalledWith('SELECT 1');
  });

  it('should return error status when database is disconnected', async () => {
    const dbError = new Error('Connection timeout');
    (mockDataSource.query as jest.Mock).mockRejectedValue(dbError);

    const result = await service.check();

    expect(result.status).toBe('error');
    expect(result.database.status).toBe('disconnected');
    expect(result.database.error).toBe('Connection timeout');
    expect(result.database.responseTime).toBeUndefined();
    expect(result.memory).toBeDefined();
    expect(result.timestamp).toBeDefined();
    expect(result.uptime).toBeGreaterThan(0);
    expect(mockDataSource.query).toHaveBeenCalledWith('SELECT 1');
  });

  it('should handle unknown database errors', async () => {
    (mockDataSource.query as jest.Mock).mockRejectedValue('Unknown error');

    const result = await service.check();

    expect(result.status).toBe('error');
    expect(result.database.status).toBe('disconnected');
    expect(result.database.error).toBe('Unknown database error');
  });

  it('should include memory usage information', async () => {
    (mockDataSource.query as jest.Mock).mockResolvedValue([{ '?column?': 1 }]);

    const result = await service.check();

    expect(result.memory).toBeDefined();
    expect(typeof result.memory.used).toBe('number');
    expect(typeof result.memory.total).toBe('number');
    expect(typeof result.memory.percentage).toBe('number');
    expect(result.memory.used).toBeGreaterThan(0);
    expect(result.memory.total).toBeGreaterThan(0);
    expect(result.memory.percentage).toBeGreaterThan(0);
    expect(result.memory.percentage).toBeLessThanOrEqual(100);
  });
});
