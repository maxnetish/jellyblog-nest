import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { UserInfoDto } from '@jellyblog-nest/auth/model';
import { LoadingStatus } from '@jellyblog-nest/utils/common';
import { GlobalActions } from '@jellyblog-nest/utils/front';

export const AUTH_FEATURE_KEY = 'auth';

export interface State {
  user: UserInfoDto | null;
  userLoadingStatus: LoadingStatus;
  userLoadError: any;
}

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: State;
}

export const initialState: State = {
  user: null,
  userLoadingStatus: LoadingStatus.INITIAL,
  userLoadError: null,
};

const authReducer = createReducer(
  initialState,

  on(
    GlobalActions.loadApp,
    (state) => {
      return {
        ...state,
        userLoadingStatus: LoadingStatus.LOADING,
      };
    },
  ),

  on(
    AuthActions.gotUserInfo,
    (state, { user }) => {
      return {
        ...state,
        userLoadingStatus: LoadingStatus.SUCCESS,
        user,
      };
    },
  ),

  on(
    AuthActions.failUserInfo,
    (state, { err }) => {
      return {
        ...state,
        userLoadingStatus: LoadingStatus.FAILED,
        userLoadError: err.message || err.statusText || err.status || err.name,
      };
    },
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return authReducer(state, action);
}
