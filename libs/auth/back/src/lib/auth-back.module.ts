import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@jellyblog-nest/entities';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport-local-strategy';
import { LocalSerializer } from './passport-local-serializer';
import { LoginGuard } from './login.guard';
import { AuthenticatedGuard } from './authenticated.guard';
import { APP_GUARD } from '@nestjs/core';
import { RequireRole } from './require-role.decorator';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    LocalSerializer,
    LoginGuard,
    {
      // Factually we provide global guard here,
      // see https://docs.nestjs.com/guard
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },
  ],
  exports: [
    TypeOrmModule,
    LoginGuard,
  ],
})
export class AuthBackModule {
}

export { AuthService, LocalStrategy, LoginGuard, RequireRole };
