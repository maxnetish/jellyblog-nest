import session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { Session } from '@jellyblog-nest/entities';
import passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

export async function setupSession(app: NestExpressApplication) {
  // We have to up connection before init express session
  const dataSource = new DataSource({
    type: 'sqlite',
    database: process.env.DBNAME || './jellyblog.sqlite',
    entities: [Session],
    synchronize: true,
  });

  await dataSource.initialize();

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
      secret: process.env.SESSION_SECRET || 'Top secret',
      store: new TypeormStore().connect(dataSource.getRepository(Session)),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  Logger.log('Session setted up');

  return app;
}
