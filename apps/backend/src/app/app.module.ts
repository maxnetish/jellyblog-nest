import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { baseEntitySchema, userSchema } from '@jellyblog-nest/entities';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: [baseEntitySchema, userSchema],
      dbName: 'jellyblog.sqlite',
      type: 'sqlite',
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
