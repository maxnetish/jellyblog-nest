import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromFilestoreList from './filestore-list.reducer';

export const selectFilestoreListState = createFeatureSelector<fromFilestoreList.State>(
  fromFilestoreList.filestoreListFeatureKey
);

export const selectDelimiter = createSelector(
  selectFilestoreListState,
  state => state.delimiter,
);

export const selectPrefix = createSelector(
  selectFilestoreListState,
  state => state.prefix,
);

export const selectLoadingStatus = createSelector(
  selectFilestoreListState,
  state => state.loadingStatus,
);

export const selectListObjectsCommandsOutputs = createSelector(
  selectFilestoreListState,
  state => state.listObjectsCommandOutputs,
);

export const selectSort = createSelector(
  selectFilestoreListState,
  state => state.sort,
);

export const selectUploaderCollapsed = createSelector(
  selectFilestoreListState,
  state => state.uploaderCollapsed,
);
