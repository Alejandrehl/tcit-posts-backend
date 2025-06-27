import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({
    summary: 'Health check',
    description:
      'Check the health status of the application and its dependencies.',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      example: {
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
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Application is unhealthy',
    schema: {
      example: {
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
      },
    },
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async check(): Promise<any> {
    return this.healthService.check();
  }
}
