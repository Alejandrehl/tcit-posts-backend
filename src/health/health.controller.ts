import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiInternalServerErrorResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { HealthService } from './health.service';

class HealthSuccessResponse {
  status: 'ok';
  timestamp: string;
  uptime: number;
  database: {
    status: 'connected';
    responseTime: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

class HealthErrorResponse {
  status: 'error';
  timestamp: string;
  uptime: number;
  database: {
    status: 'disconnected';
    error: string;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

class ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

@ApiTags('health')
@ApiExtraModels(HealthSuccessResponse, HealthErrorResponse, ErrorResponse)
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Health check endpoint
   * @returns Health status of the application and its dependencies
   */
  @ApiOperation({
    summary: 'Health check',
    description:
      'Check the health status of the application and its dependencies. Returns detailed information about the app, database, and memory usage. Returns 200 if healthy, 503 if unhealthy.',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: { $ref: getSchemaPath(HealthSuccessResponse) },
    examples: {
      healthy: {
        summary: 'Healthy response',
        value: {
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
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Application is unhealthy',
    schema: { $ref: getSchemaPath(HealthErrorResponse) },
    examples: {
      unhealthy: {
        summary: 'Unhealthy response',
        value: {
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
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error.',
    schema: { $ref: getSchemaPath(ErrorResponse) },
    examples: {
      serverError: {
        summary: 'Internal server error',
        value: {
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error',
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
