import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as AuthActions from './auth.actions';
import * as AuthFeature from './auth.reducer';
import { GlobalActions } from '@jellyblog-nest/utils/front';
import { catchError, map, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthEffects {

  init$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(GlobalActions.loadApp),
        switchMap(() => {
          return this.authService.getCurrentUser();
        }),
        map((userInfo) => {
          return AuthActions.gotUserInfo({ user: userInfo });
        }),
        catchError((err, caught) => {
          this.store.dispatch(AuthActions.failUserInfo({ err }));
          return caught;
        }),
      );
    },
  );

  constructor(
    private store: Store,
    private readonly actions$: Actions,
    private readonly authService: AuthService,
  ) {
  }
}
