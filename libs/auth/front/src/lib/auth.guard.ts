import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { map } from 'rxjs';
import { AuthFacade } from '@jellyblog-nest/auth/front';
import { UserRole } from '@jellyblog-nest/utils/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
  ) {
    let requiredRoles = route.data?.role as (UserRole | UserRole[]);
    if (requiredRoles && !Array.isArray(requiredRoles)) {
      requiredRoles = [requiredRoles];
    }
    if (requiredRoles && requiredRoles.length) {
      return this.authFacade.user$.pipe(
        map(user => {
          return !!(
            user && requiredRoles.includes(user.role)
          );
        }));
    }
    return true;
  }

  constructor(
    private readonly authFacade: AuthFacade,
  ) {
  }
}
