import { NgModule } from '@angular/core';
import { UserListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';
import {
  AppRoute,
} from '@jellyblog-nest/utils/front';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUsersList from './list/store/users-list.reducer';
import { UsersListEffects } from './list/store/users-list.effects';
import { UserCreateModalService } from './user-create/user-create.modal.service';
import { UserUpdateModalService } from './user-update/user-update.modal.service';
import { UserSetPasswordModalService } from './user-set-password/user-set-password.modal.service';
import { UserRemoveModalService } from './user-remove/user-remove.modal.service';

const routes: AppRoute[] = [
  {
    path: '',
    redirectTo: 'reg',
    pathMatch: 'full',
  },
  {
    path: 'reg',
    component: UserListComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(
      fromUsersList.USERSLIST_FEATURE_KEY,
      fromUsersList.reducer,
    ),
    EffectsModule.forFeature([UsersListEffects]),
  ],
  declarations: [
  ],
  providers: [
    // Services using in store effects, so keep here
    UserCreateModalService,
    UserUpdateModalService,
    UserSetPasswordModalService,
    UserRemoveModalService,
  ],
  exports: [],
})
export class UsersFrontModule {
}
