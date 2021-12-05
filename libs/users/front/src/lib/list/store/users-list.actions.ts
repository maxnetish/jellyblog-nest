import { createAction, props } from '@ngrx/store';
import * as ListModel from '../list.model';
import { UserInfoDto } from '@jellyblog-nest/auth/model';
import { Page } from '@jellyblog-nest/utils/common';

export const init = createAction('[UsersList Page] Init');

export const commitSearchCriteria = createAction(
  '[UsersList] commit search criteria',
  props<{ searchCriteria: ListModel.SearchFormModel }>(),
);

export const goToPage = createAction(
  '[UsersList] fetch page',
  props<{ page: number }>(),
);

export const changePageSize = createAction(
  '[UsersList] change page size',
  props<{ pageSize: number }>(),
);

export const changeSortField = createAction(
  '[UsersList] change sort field',
  props<{ sortField: keyof Omit<UserInfoDto, 'uuid'> }>(),
);

export const toggleSortOrder = createAction(
  '[UsersList] toggle sort order',
);

export const gotUsersPage = createAction(
  '[UsersList] got users page',
  props<{ usersPage: Page<UserInfoDto> }>(),
);

export const failUsersPage = createAction(
  '[UsersList] fail users page',
  props<{ error: any }>(),
);

export const createUser = createAction(
  '[UsersList] create user',
);

export const updateUser = createAction(
  '[UsersList] update user',
  props<{user: UserInfoDto}>(),
);
