import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import { getRepository } from 'typeorm';

import { AppModule } from './app/app.module';
import { Session } from '@jellyblog-nest/entities';
import { TypeormStore } from 'connect-typeorm';
import { NestExpressApplication } from '@nestjs/platform-express';
import passport from 'passport';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = 'api';

  app.set('trust proxy', 1);

  app.use(
    session({
      cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        // TODO set true for prod
        secure: false,
      },
      name: 'jbn.sid',
      // use setting from express
      // proxy: true,
      resave: false,
      rolling: true,
      saveUninitialized: false,
      // TODO read from env
      secret: 'Top secret',
      store: new TypeormStore().connect(getRepository(Session)),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3333;

  // setup swagger
  const swaggerDocumentConfig = new DocumentBuilder()
    .setTitle('Jellyblog')
    .setDescription('Jellyblog web API')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerDocumentConfig);
  SwaggerModule.setup('api/swagger', app, swaggerDocument);

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
