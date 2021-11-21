import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';
import { AppRoute } from '@jellyblog-nest/utils/front';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUsersList from './list/store/users-list.reducer';
import { UsersListEffects } from './list/store/users-list.effects';

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
      fromUsersList.reducer
    ),
    EffectsModule.forFeature([UsersListEffects]),
  ],
  declarations: [UserListComponent],
  exports: [],
})
export class UsersFrontModule {}
