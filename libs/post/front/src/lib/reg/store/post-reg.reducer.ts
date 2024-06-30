import { FindPostRequest, PostShortDto } from '@jellyblog-nest/post/model';
import { Action, createReducer, on } from '@ngrx/store';
import { LoadingStatus, SortOrder } from '@jellyblog-nest/utils/common';
import * as PostRegActions from './post-reg.actions';

export const POST_REG_FEATURE_KEY = 'postReg';

export interface State {
  posts: PostShortDto[];
  criteria: FindPostRequest;
  loadingStatus: LoadingStatus;
  total: number;
}

export const initialState: State = {
  posts: [],
  criteria: {
    order: {
      createdAt: SortOrder.DESC,
    },
    size: 10,
    page: 1,
    tag: [],
    text: null,
    status: [],
    allowRead: [],
    createdAtFrom: null,
    createdAtTo: null,
  },
  loadingStatus: LoadingStatus.INITIAL,
  total: 0,
}

const postRegReducer = createReducer(
  initialState,

  on(
    PostRegActions.init,
    (state) => {
      return {
        ...state,
        loadingStatus: LoadingStatus.LOADING,
      };
    },
  ),

  on(
    PostRegActions.gotPage,
    (state, action) => {
      return {
        ...state,
        loadingStatus: LoadingStatus.SUCCESS,
        total: action.page.total,
        posts: [...action.page.list],
      };
    },
  ),

  on(
    PostRegActions.failPage,
    (state) => {
      return {
        ...state,
        loadingStatus: LoadingStatus.FAILED
      };
    },
  ),

);

export function reducer(state: State | undefined, action: Action) {
  return postRegReducer(state, action);
}
