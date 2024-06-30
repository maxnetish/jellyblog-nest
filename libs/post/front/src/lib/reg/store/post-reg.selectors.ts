import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as PostRegReducer from './post-reg.reducer';

export const selectPostRegState = createFeatureSelector<PostRegReducer.State>(
  PostRegReducer.POST_REG_FEATURE_KEY,
);

export const selectCriteria = createSelector(
  selectPostRegState,
  state => state.criteria,
);

export const selectPosts = createSelector(
  selectPostRegState,
  state => state.posts,
);

export const selectLoadingStatus = createSelector(
  selectPostRegState,
  state => state.loadingStatus,
);
