import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { from, Observable, of, switchMap, mapTo } from 'rxjs';

@Injectable()
export class LoginGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext): Observable<boolean> {
    const canValueOrObservableOrPromise = super.canActivate(context);

    return from(
      typeof canValueOrObservableOrPromise === 'boolean'
        ? [canValueOrObservableOrPromise]
        : canValueOrObservableOrPromise,
    ).pipe(
      switchMap((can) => {
        if (can) {
          const request = context.switchToHttp().getRequest();
          return from(super.logIn(request)).pipe(
            mapTo(can),
          );
        }
        return of(can);
      }),
    );
  }
}
