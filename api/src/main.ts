import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Project description
  app.setGlobalPrefix('api/v1');

  //Set Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //automatically removes any property not defined in the DTO, preventing extra data from being processed.
      forbidNonWhitelisted: true, //throw error if the request contains unexpected properties enforcing strict DTO validation
      transform: true, //automatically convert plain request objects into DTO class instances
      transformOptions: {
        enableImplicitConversion: true, //allows automatic conversion of primitive types based on DTO's type annotation
      },
    }),
  );

  //Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [
      'http://localhost:3001',
      'https://next-nest-ecommerce-lovat.vercel.app', // ← thêm domain Vercel
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  //Enable Swagger docs
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API Documentation for the description')
    .setVersion('1.0')
    .addTag('auth', 'Authenticated related endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Refresh-JWT',
        description: 'Enter refresh JWT token',
        in: 'header',
      },
      'JWT-refresh',
    )
    .addServer(`http://localhost:${process.env.PORT}`, 'Development server')
    .addServer(`https://ecommercenestapi.duckdns.org`, 'Production server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar {display: none}
      .swagger-ui .info {margin: 50px 0;}
      .swagger-ui .info .title {color: #4A90E2;}
    `,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((error) => {
  Logger.error('Error starting server', error);
  process.exit(1);
});
