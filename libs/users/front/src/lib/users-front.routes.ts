import { UserListComponent } from './list/list.component';
import {
  AppRoute,
} from '@jellyblog-nest/utils/front';
import { provideState } from '@ngrx/store';
import * as fromUsersList from './list/store/users-list.reducer';
import { provideEffects } from '@ngrx/effects';
import { UsersListEffects } from './list/store/users-list.effects';
import { UserCreateModalService } from './user-create/user-create.modal.service';
import { UserUpdateModalService } from './user-update/user-update.modal.service';
import { UserRemoveModalService } from './user-remove/user-remove.modal.service';
import { UserSetPasswordModalService } from './user-set-password/user-set-password.modal.service';

export const UserRoutes: AppRoute[] = [
  {
    path: '',
    providers: [
      provideState(
        fromUsersList.USERSLIST_FEATURE_KEY,
        fromUsersList.reducer,
      ),
      provideEffects([
        UsersListEffects,
      ]),
      UserCreateModalService,
      UserUpdateModalService,
      UserRemoveModalService,
      UserSetPasswordModalService,
    ],
    children: [
      {
        path: '',
        redirectTo: 'reg',
        pathMatch: 'full',
      },
      {
        path: 'reg',
        component: UserListComponent,
      },
    ],
  },
];
