import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as AuthSelectors from './auth.selectors';
import { filter, map, switchMap } from 'rxjs';
import { LoadingStatus } from '@jellyblog-nest/utils/common';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {

  loadingStatus$ = this.store.pipe(select(AuthSelectors.selectUserLoadingStatus));

  user$ = this.loadingStatus$.pipe(
    filter((loadingStatus) => {
      return [LoadingStatus.SUCCESS, LoadingStatus.FAILED].indexOf(loadingStatus) > -1;
    }),
    switchMap(() => {
      return this.store.select(AuthSelectors.selectUser);
    }),
  );

  userRole$ = this.user$.pipe(
    map((userOrNull) => {
      if (userOrNull) {
        return userOrNull.role;
      }
      return null;
    }),
  );

  constructor(private readonly store: Store) {}
}
