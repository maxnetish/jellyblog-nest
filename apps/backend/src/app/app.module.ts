import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthBackModule } from '@jellyblog-nest/auth/back';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { Session } from '@jellyblog-nest/entities';
import { SettingsBackModule } from '@jellyblog-nest/settings/back';
import { PostBackModule } from '@jellyblog-nest/post/back';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './jellyblog.sqlite',
      synchronize: true,
      autoLoadEntities: true,
      entities: [Session],
    }),
    AuthBackModule,
    SettingsBackModule,
    PostBackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
