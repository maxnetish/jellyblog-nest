import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlCreationOptions } from '@angular/router';
import { map } from 'rxjs';
import { AuthFacade } from './store/auth.facade';
import { UserRole } from '@jellyblog-nest/utils/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardNg implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot
  ) {
    let requiredRoles = route.data?.role as (UserRole | UserRole[]);
    const redirectCommandsIfNoRole = route.data?.redirectCommandsIfNoRole as string[]
      || ['/insufficient-rights'];
    const redirectOptionsIfNoRole = route.data?.redirectOptionsIfNoRole as UrlCreationOptions
      || undefined;
    if (requiredRoles && !Array.isArray(requiredRoles)) {
      requiredRoles = [requiredRoles];
    }
    if (requiredRoles && requiredRoles.length) {
      return this.authFacade.userRole$.pipe(
        map(userRole => {
          return !!(
            userRole && requiredRoles.includes(userRole)
          );
        }),
        map((permission) => {
          if(permission) {
            return true;
          }
          return this.router.createUrlTree(redirectCommandsIfNoRole, redirectOptionsIfNoRole);
        }),
      );
    }
    return true;
  }

  constructor(
    private readonly authFacade: AuthFacade,
    private readonly router: Router,
  ) {
  }
}
