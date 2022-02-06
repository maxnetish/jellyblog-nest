import { createAction, props } from '@ngrx/store';
import { CopyObjectCommandOutput, ListObjectsCommandOutput } from '@aws-sdk/client-s3';
import { SortOption } from '@jellyblog-nest/utils/common';
import { FileInfo } from './file-info';

export const beginBrowse = createAction(
  '[FilestoreList] Begin Browse',
);

export const changeFolder = createAction(
  '[FilestoreList] Change Folder',
  props<{ prefix: string }>(),
);

export const gotListObjectsCommandOutput = createAction(
  '[FilestoreList] Got ListObjectsCommandOutput',
  props<{ response: ListObjectsCommandOutput }>(),
);

export const gotNextListObjectsCommandOutput = createAction(
  '[FilestoreList] Got Next ListObjectsCommandOutput',
  props<{ response: ListObjectsCommandOutput }>(),
);

export const failListObjectsCommandOutput = createAction(
  '[FilestoreList] Fail ListObjectsCommandOutput',
  props<{ err: any }>(),
);

export const changeSort = createAction(
  '[FilestoreList] Change Sort',
  props<{ sort: SortOption<FileInfo> }>(),
);

export const deleteObject = createAction(
  '[FilestoreList] Delete Object',
  props<{ key: string }>(),
);

export const deleteObjectSuccess = createAction(
  '[FilestoreList] Delete Object success',
  props<{ key: string }>(),
);

export const deleteObjectFail = createAction(
  '[FilestoreList] Delete Object fail',
  props<{ err: any }>(),
);

export const renameObject = createAction(
  '[FilestoreList] Rename Object',
  props<{ currentKey: string, newKey: string }>(),
);

export const renameObjectSuccess = createAction(
  '[FilestoreList] Rename Object Success',
  props<{ currentKey: string, newKey: string, output: CopyObjectCommandOutput }>(),
);

export const renameObjectFail = createAction(
  '[FilestoreList] Rename Object Fail',
  props<{err: any}>(),
);
