import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security: Enable CORS
  const corsOrigins = configService.get<string>('CORS_ORIGINS') || 'http://localhost:3000,http://localhost:3001';
  app.enableCors({
    origin: corsOrigins.split(','),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`✅ Sanito Backend listening on port ${port}`);
  console.log(`📚 API running at http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to bootstrap application:', err);
  process.exit(1);
});
