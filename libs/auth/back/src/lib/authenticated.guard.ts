import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@jellyblog-nest/utils/common';
import { UserInfoDto } from '@jellyblog-nest/auth/model';

/**
 * Guard checks user role.
 * Role set for route handler by RequireRole decorator
 *
 * @example @RequireRole(UserRole.ADMIN, UserRole.READER) - list of required roles
 * @example @RequireRole() - any logged in user
 *
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
  ) {
  }

  canActivate(context: ExecutionContext) {
    const requireRole = this.reflector.get<UserRole[]>('requireRole', context.getHandler());

    if (!requireRole) {
      // requireRole not provided - it`s open request
      return true;
    }

    const req = context.switchToHttp().getRequest();

    // requireRole provided, user have to be authenticated
    if(!req.isAuthenticated()) {
      return false;
    }

    // requireRole: []
    // means that require any authenticated user
    if (requireRole.length === 0) {
      return true;
    }

    // else check that user.role includes in requireRole
    const { role } = req.user as UserInfoDto;
    return requireRole.indexOf(role) > -1;
  }

}
