import { FindUserRequest, UserInfoDto } from '@jellyblog-nest/auth/model';
import { LoadingStatus, SortOrder } from '@jellyblog-nest/utils/common';
import { ComponentStore } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface UsersListStoreState {
  users: UserInfoDto[];
  usersLoadingStatus: LoadingStatus;
  usersCriteria: FindUserRequest;
}

@Injectable()
export class UsersListStore extends ComponentStore<UsersListStoreState> {

  private readonly apiPathAuth = '/api/auth';

  constructor(
    private http: HttpClient,
  ) {
    super({
      users: [],
      usersCriteria: {
        page: 1,
        size: 10,
        order: {
          username: SortOrder.ASC,
        },
      },
      usersLoadingStatus: LoadingStatus.INITIAL,
    });
  }

  readonly users$ = this.select(
    (state) => state.users,
  );

  readonly page$ = this.select(
    (state) => state.usersCriteria.page,
  );

  readonly size$ = this.select(
    (state) => state.usersCriteria.size,
  );

  readonly fetchUsersPage = this.effect(
    (criteria$: Observable<UsersListStoreState['usersCriteria']>) => {
      return criteria$.pipe(
        switchMap((criteria) => {
          return this.http.get(
            `${this.apiPathAuth}/users`,
            // TODO Дописать запрос
          )
        })
      )
    }
  )
}
