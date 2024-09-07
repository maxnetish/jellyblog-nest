import { ChangeDetectionStrategy, Component, inject, Signal, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ListStoreActions from './store/users-list.actions';
import * as ListStoreSelectors from './store/users-list.selectors';
import { UserInfoDto } from '@jellyblog-nest/auth/model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { heroBars3, heroLockClosed, heroUserMinus, heroUsers } from '@ng-icons/heroicons/outline';
import { heroUserPlusSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIconComponent,
    NgbPagination,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
  ],
  providers: [
    provideIcons({
      heroBars3,
      heroUsers,
      heroLockClosed,
      heroUserMinus,
      heroUserPlusSolid,
    }),
  ],
})
export class UserListComponent {

  private readonly store = inject(Store);

  protected readonly users = this.store.selectSignal(ListStoreSelectors.getUsersList);

  protected readonly total = this.store.selectSignal(ListStoreSelectors.getTotal);

  protected readonly page = this.store.selectSignal(ListStoreSelectors.getPage);

  protected readonly pageSize = this.store.selectSignal(ListStoreSelectors.getPageSize);

  constructor() {
    this.store.dispatch(ListStoreActions.init());
  }

  handleAddUserButtonClick() {
    this.store.dispatch(ListStoreActions.createUser());
  }

  handlePageChange(newPage: number) {
    this.store.dispatch(ListStoreActions.goToPage({page: newPage}));
  }

  handleChangeRoleClick(user: UserInfoDto) {
    this.store.dispatch(ListStoreActions.updateUser({user}));
  }

  handleRemoveClick(user: UserInfoDto) {
    this.store.dispatch(ListStoreActions.removeUser({user}));
  }

  handleSetPasswordClick(user: UserInfoDto) {
    this.store.dispatch(ListStoreActions.setPassword({user}));
  }

}
