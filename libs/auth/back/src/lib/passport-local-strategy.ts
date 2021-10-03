import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy as LocalStrategyBase } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(LocalStrategyBase) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super();
  }

  async validate(username: string, password: string) {
    return await this.authService.findAndVerify({ username, password });
  }
}
