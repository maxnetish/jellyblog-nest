import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromReducer from './users-list.reducer';

// Lookup the 'UsersList' feature state managed by NgRx
export const getUsersListState = createFeatureSelector<fromReducer.State>(
  fromReducer.USERSLIST_FEATURE_KEY,
);

export const getUsersList = createSelector(
  getUsersListState,
  (state) => state.users,
);

export const getUsersListLoadingStatus = createSelector(
  getUsersListState,
  (state) => state.usersLoadignStatus,
);

export const getSearchCriteria = createSelector(
  getUsersListState,
  (state) => state.searchCriteria,
);

export const getPage = createSelector(
  getUsersListState,
  state => state.page,
);

export const getPageSize = createSelector(
  getUsersListState,
  state=> state.pageSize,
);

export const getSortField = createSelector(
  getUsersListState,
  state => state.sortField,
);

export const getSortOrder = createSelector(
  getUsersListState,
  state => state.sortOrder,
);

