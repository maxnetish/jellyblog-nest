import { Action, createReducer, on } from '@ngrx/store';

import * as UsersListActions from './users-list.actions';
import { UserInfoDto } from '@jellyblog-nest/auth/model';
import { LoadingStatus, SortOrder } from '@jellyblog-nest/utils/common';
import * as ListModel from '../list.model';

export const USERSLIST_FEATURE_KEY = 'usersList';

export interface State {
  users: UserInfoDto[];
  searchCriteria: ListModel.SearchFormModel;
  sortField: keyof Omit<UserInfoDto, 'uuid'>;
  sortOrder: SortOrder;
  page: number,
  pageSize: number,
  total: number,
  usersLoadignStatus: LoadingStatus;
}

export const initialState: State = {
  users: [],
  searchCriteria: {},
  sortField: 'username',
  sortOrder: SortOrder.ASC,
  page: 1,
  pageSize: 10,
  total: 0,
  usersLoadignStatus: LoadingStatus.INITIAL,
};

const usersListReducer = createReducer(
  initialState,

  on(
    UsersListActions.init,
    (state) => {
      return {
        ...state,
        usersLoadignStatus: LoadingStatus.LOADING,
      };
    },
  ),

  on(
    UsersListActions.commitSearchCriteria,
    (state, { searchCriteria }) => {
      return {
        ...state,
        usersLoadignStatus: LoadingStatus.LOADING,
        searchCriteria: searchCriteria,
        page: 1,
      };
    },
  ),

  on(
    UsersListActions.gotUsersPage,
    (state, { usersPage }) => {
      return {
        ...state,
        users: usersPage.list,
        total: usersPage.total,
        page: usersPage.page,
        pageSize: usersPage.size,
        usersLoadignStatus: LoadingStatus.SUCCESS,
      };
    },
  ),

  on(
    UsersListActions.changeSortField,
    (state, { sortField }) => {
      return {
        ...state,
        page: 1,
        sortField,
        usersLoadignStatus: LoadingStatus.LOADING,
      };
    },
  ),

  on(
    UsersListActions.goToPage,
    (state, { page }) => {
      return {
        ...state,
        usersLoadignStatus: LoadingStatus.LOADING,
        page,
      };
    },
  ),

  on(
    UsersListActions.changePageSize,
    (state, { pageSize }) => {
      return {
        ...state,
        usersLoadignStatus: LoadingStatus.LOADING,
        page: 1,
        pageSize,
      };
    },
  ),

  on(
    UsersListActions.toggleSortOrder,
    (state) => {
      return {
        ...state,
        page: 1,
        sortOrder: state.sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC,
        usersLoadignStatus: LoadingStatus.LOADING,
      };
    },
  ),

  on(
    UsersListActions.failUsersPage,
    (state) => {
      return {
        ...state,
        usersLoadignStatus: LoadingStatus.FAILED,
      };
    },
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return usersListReducer(state, action);
}
