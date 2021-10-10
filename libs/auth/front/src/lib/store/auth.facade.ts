import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as AuthSelectors from './auth.selectors';

@Injectable()
export class AuthFacade {
  user$ = this.store.pipe(select(AuthSelectors.selectUser));
  loadingStatus$ = this.store.pipe(select(AuthSelectors.selectUserLoadingStatus));

  constructor(private readonly store: Store) {}
}
