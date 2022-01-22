import { createAction, props } from '@ngrx/store';
import { ListObjectsCommandOutput } from '@aws-sdk/client-s3';

export const beginBrowseAtPrefix = createAction(
  '[FilestoreList] Init List',
  props<{prefix?: string}>(),
);

export const gotListObjectsCommandOutput = createAction(
  '[FilestoreList] Got ListObjectsCommandOutput',
  props<{response: ListObjectsCommandOutput}>(),
);

export const failListObjectsCommandOutput = createAction(
  '[FilestoreList] Fail ListObjectsCommandOutput',
  props<{err: any}>(),
);
