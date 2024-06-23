import "reflect-metadata"
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupSession } from './main-setup-session';
import { setupSwagger } from './main-setup-swagger';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = process.env.API_PREFIX || 'api';
  const port = Number(process.env.PORT) || 3333;

  app.set('trust proxy', 1);

  await setupSession(app);

  app.setGlobalPrefix(globalPrefix);
  // Working good when transform request from json, but
  // for query params we should apply transformation BEFORE ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  // setup swagger
  setupSwagger(app);

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
