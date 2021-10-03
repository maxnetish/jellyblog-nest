import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@jellyblog-nest/entities';
import { AuthService } from './auth.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {

  constructor(
    private authService: AuthService,
  ) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.uuid);
  }

  async deserializeUser(userUuid: string, done: CallableFunction) {
    const found = await this.authService.findById(userUuid);
    if (found) {
      done(null, found);
    } else {
      done(new Error('User not found'));
    }
  }
}
