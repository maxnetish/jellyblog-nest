import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';
import { AppRoute, UtilsFrontModule } from '@jellyblog-nest/utils/front';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUsersList from './list/store/users-list.reducer';
import { UsersListEffects } from './list/store/users-list.effects';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserCreateModalService } from './user-create/user-create.modal.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

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
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(
      fromUsersList.USERSLIST_FEATURE_KEY,
      fromUsersList.reducer,
    ),
    EffectsModule.forFeature([UsersListEffects]),
    ReactiveFormsModule,
    NgSelectModule,
    UtilsFrontModule,
  ],
  declarations: [UserListComponent, UserCreateComponent],
  providers: [
    UserCreateModalService,
  ],
  exports: [],
})
export class UsersFrontModule {}
