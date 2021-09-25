import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@jellyblog-nest/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [
    TypeOrmModule,
  ],
})
export class AuthBackModule {
}

export { AuthService };
