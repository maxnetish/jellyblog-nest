import { createAction, props } from '@ngrx/store';
import { ListObjectsCommandOutput } from '@aws-sdk/client-s3';

export const beginBrowse = createAction(
  '[FilestoreList] Begin Browse',
);

export const changeFolder = createAction(
  '[FilestoreList] Change Folder',
  props<{prefix: string}>(),
);

export const gotListObjectsCommandOutput = createAction(
  '[FilestoreList] Got ListObjectsCommandOutput',
  props<{response: ListObjectsCommandOutput}>(),
);

export const failListObjectsCommandOutput = createAction(
  '[FilestoreList] Fail ListObjectsCommandOutput',
  props<{err: any}>(),
);
