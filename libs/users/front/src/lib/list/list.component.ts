import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ListStoreActions from './store/users-list.actions';
import * as ListStoreSelectors from './store/users-list.selectors';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { UserInfoDto } from '@jellyblog-nest/auth/model';
import { UserCreateModalService } from '../user-create/user-create.modal.service';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class UserListComponent implements OnInit {

  users$: Observable<UserInfoDto[]>;

  trackUsers(_: unknown, item: UserInfoDto) {
    return item.uuid;
  }

  private async addUser() {
    try {
      await this.userCreateModalService.show();
      this.store.dispatch(ListStoreActions.init());
    } catch (e) {
      console.log('error: ', e);
    }
  }

  constructor(
    private readonly store: Store,
    private readonly userCreateModalService: UserCreateModalService,
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
  }

  ngOnInit(): void {
    // this.store.dispatch(ListStoreActions.init());
  }

  handleAddUserButtonClick() {
    this.addUser();
  }
}
