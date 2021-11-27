import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';

import * as UsersListActions from './users-list.actions';
import * as fromUserSelectors from './users-list.selectors';
import { AuthService } from '@jellyblog-nest/auth/front';
import { FindUserRequest } from '@jellyblog-nest/auth/model';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';

@Injectable()
export class UsersListEffects {

  fetchUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UsersListActions.init,
        UsersListActions.toggleSortOrder,
        UsersListActions.changePageSize,
        UsersListActions.changeSortField,
        UsersListActions.commitSearchCriteria,
        UsersListActions.goToPage,
      ),
      withLatestFrom(
        this.store.select(fromUserSelectors.getSearchCriteria),
        this.store.select(fromUserSelectors.getPage),
        this.store.select(fromUserSelectors.getPageSize),
        this.store.select(fromUserSelectors.getSortField),
        this.store.select(fromUserSelectors.getSortOrder),
      ),
      switchMap(([, criteria, page, size, sortField, sortOrder]) => {
        return this.authService.findUsers(
          new FindUserRequest({
            page,
            size,
            order: {
              [sortField]: sortOrder,
            },
            name: criteria.name,
            role: criteria.role,
          }),
        );
      }),
      map((response) => {
        return UsersListActions.gotUsersPage({ usersPage: response });
      }),
      catchError((error, caught) => {
        this.store.dispatch(GlobalActions.addGlobalToast({
          severity: GlobalToastSeverity.ERROR,
          text: error.message || 'Fail',
        }));
        this.store.dispatch(UsersListActions.failUsersPage({ error }));
        return caught;
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly store: Store,
  ) {
  }
}
