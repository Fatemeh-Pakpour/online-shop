import 'reflect-metadata';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const isProduction = config.get<string>('NODE_ENV') === 'production';

  // The Apollo Sandbox landing page needs a relaxed CSP in development.
  app.use(
    helmet({
      contentSecurityPolicy: isProduction,
      crossOriginEmbedderPolicy: isProduction,
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>('FRONTEND_URL'),
    credentials: true,
  });
  // // Usually unnecessary with Zod
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // enables Nest’s shutdown lifecycle.
  app.enableShutdownHooks();

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`API ready at http://localhost:${port}/graphql`);
}

// void Start bootstrap(), but do not await or observe its returned Promise.
// So the caller does not wait to know whether the Promise is:pending, resolved successfully, rejected with an error
void bootstrap();
