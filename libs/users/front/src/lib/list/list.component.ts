import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ListStoreActions from './store/users-list.actions';
import * as ListStoreSelectors from './store/users-list.selectors';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { UserInfoDto } from '@jellyblog-nest/auth/model';

@Component({
  selector: 'app-users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class UserListComponent implements OnInit {

  users$: Observable<UserInfoDto[]>;
  total$: Observable<number>;
  page$: Observable<number>;
  pageSize$: Observable<number>;

  trackUsers(_: unknown, item: UserInfoDto) {
    return item.uuid;
  }

  constructor(
    private readonly store: Store,
  ) {
    this.users$ = of(null).pipe(
      take(1),
      tap(() => {
        this.store.dispatch(ListStoreActions.init());
      }),
      switchMap(() => {
        return this.store.select(ListStoreSelectors.getUsersList);
      }),
    );
    this.total$ = this.store.select(ListStoreSelectors.getTotal);
    this.page$ = this.store.select(ListStoreSelectors.getPage);
    this.pageSize$ = this.store.select(ListStoreSelectors.getPageSize);
  }

  ngOnInit(): void {
    // this.store.dispatch(ListStoreActions.init());
  }

  handleAddUserButtonClick() {
    this.store.dispatch(ListStoreActions.createUser());
  }

  handlePageChange(newPage: number) {
    this.store.dispatch(ListStoreActions.goToPage({ page: newPage }));
  }

  handleChangeRoleClick(user: UserInfoDto) {
    this.store.dispatch(ListStoreActions.updateUser({ user }));
  }

  handleRemoveClick(user: UserInfoDto) {

  }

  handleSetPasswordClick(user: UserInfoDto) {

  }
}
