import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlCreationOptions } from '@angular/router';
import { map } from 'rxjs';
import { AuthFacade } from './store/auth.facade';
import { UserRole } from '@jellyblog-nest/utils/common';

export const AuthGuardNg: CanActivateFn = (route, state) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);
  let requiredRoles = route.data?.role as (UserRole | UserRole[]);
  const redirectCommandsIfNoRole = route.data?.redirectCommandsIfNoRole as string[]
    || ['/login'];
  const redirectOptionsIfNoRole = route.data?.redirectOptionsIfNoRole as UrlCreationOptions
    || {
      queryParams: {
        // afterLogin: this.location.path(false),
        afterLogin: state.url,
      },
    };
  if (requiredRoles && !Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }
  if (requiredRoles && requiredRoles.length) {
    return authFacade.userRole$.pipe(
      map(userRole => {
        return !!(
          userRole && requiredRoles.includes(userRole)
        );
      }),
      map((permission) => {
        if (permission) {
          return true;
        }
        return router.createUrlTree(redirectCommandsIfNoRole, redirectOptionsIfNoRole);
      }),
    );
  }
  return true;
}
