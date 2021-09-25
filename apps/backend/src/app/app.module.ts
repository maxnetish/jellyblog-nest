import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthBackModule } from '@jellyblog-nest/auth/back';
import { TypeOrmModule } from '@nestjs/typeorm';
import { allEntities } from '@jellyblog-nest/entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './jellyblog.sqlite',
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthBackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
