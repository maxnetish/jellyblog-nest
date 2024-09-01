import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';
import {
  AppRoute,
  ModalContentComponent,
  UtilsFrontModule,
  ValidationMessageComponent,
} from '@jellyblog-nest/utils/front';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUsersList from './list/store/users-list.reducer';
import { UsersListEffects } from './list/store/users-list.effects';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserCreateModalService } from './user-create/user-create.modal.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIconsModule } from '@ng-icons/core';
import {
  heroUserMinus,
  heroUser,
  heroUsers,
  heroEllipsisVertical,
  heroBars3,
  heroLockClosed,
  heroXMark, heroUserPlus,
} from '@ng-icons/heroicons/outline';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserUpdateModalService } from './user-update/user-update.modal.service';
import { UserSetPasswordComponent } from './user-set-password/user-set-password.component';
import { UserSetPasswordModalService } from './user-set-password/user-set-password.modal.service';
import { UserRemoveComponent } from './user-remove/user-remove.component';
import { UserRemoveModalService } from './user-remove/user-remove.modal.service';
import { UtilsFrontFileUploaderModule } from '@jellyblog-nest/utils/front-file-uploader';
import { heroUserPlusSolid } from '@ng-icons/heroicons/solid';

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
    NgbPaginationModule,
    NgbDropdownModule,
    NgIconsModule.withIcons({
      heroUserMinus,
      heroUser,
      heroUsers,
      heroEllipsisVertical,
      heroBars3,
      heroLockClosed,
      heroXMark,
      heroUserPlusSolid,
    }),
    UtilsFrontFileUploaderModule,
    ModalContentComponent,
    ValidationMessageComponent,
  ],
  declarations: [
    UserListComponent,
    UserCreateComponent,
    UserUpdateComponent,
    UserSetPasswordComponent,
    UserRemoveComponent,
  ],
  providers: [
    UserCreateModalService,
    UserUpdateModalService,
    UserSetPasswordModalService,
    UserRemoveModalService,
  ],
  exports: [],
})
export class UsersFrontModule {
}
