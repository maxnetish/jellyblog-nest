import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

/**
 * Guard checks that user logged in
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }

}
