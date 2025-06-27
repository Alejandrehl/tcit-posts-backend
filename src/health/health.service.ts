import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

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

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async check(): Promise<HealthCheckResult> {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memory = {
      used: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
      percentage:
        Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100 * 100) /
        100,
    };

    // Check database connectivity
    let databaseStatus: 'connected' | 'disconnected' = 'disconnected';
    let responseTime: number | undefined;
    let databaseError: string | undefined;

    try {
      const dbStartTime = Date.now();
      await this.dataSource.query('SELECT 1');
      responseTime = Date.now() - dbStartTime;
      databaseStatus = 'connected';
    } catch (error) {
      databaseError =
        error instanceof Error ? error.message : 'Unknown database error';
    }

    // Determine overall status
    const overallStatus: 'ok' | 'error' =
      databaseStatus === 'connected' ? 'ok' : 'error';

    const database = {
      status: databaseStatus,
      ...(databaseStatus === 'connected' && { responseTime }),
      ...(databaseError && { error: databaseError }),
    };

    return {
      status: overallStatus,
      timestamp,
      uptime,
      database,
      memory,
    };
  }
}
