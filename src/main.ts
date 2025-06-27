import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );
  await app.register(helmet);
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Posts API')
    .setDescription(
      'A comprehensive REST API for managing blog posts and content. This API provides endpoints for creating, reading, and deleting posts with full CRUD operations support.',
    )
    .setVersion('1.0.0')
    .addServer('http://localhost:3000', 'Development server')
    .addServer('https://api.example.com', 'Production server')
    .setContact(
      'Alejandro Exequiel Hernández Lara',
      'https://www.linkedin.com/in/alejandrehl/',
      'alejandrehl@icloud.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('posts', 'Operations related to blog posts management')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'Posts API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });
  await app.listen(3000, '0.0.0.0');
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
