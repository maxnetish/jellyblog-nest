import { createAction, props } from '@ngrx/store';
import { UserInfoDto } from '@jellyblog-nest/auth/model';

export const gotUserInfo = createAction(
  '[Auth] Load user Success',
  props<{ user: UserInfoDto | null }>(),
);

export const failUserInfo = createAction(
  '[Auth] Load user Failure',
  props<{ err: any }>(),
);
