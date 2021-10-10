import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUTH_FEATURE_KEY, State } from './auth.reducer';

// Lookup the 'Auth' feature state managed by NgRx
export const selectAuthState = createFeatureSelector<State>(AUTH_FEATURE_KEY);

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user,
);

export const selectUserLoadingStatus = createSelector(
  selectAuthState,
  (state) => state.userLoadingStatus,
);

export const selectUserRole = createSelector(
  selectUser,
  (user) => user
    ? user.role
    : null,
);
