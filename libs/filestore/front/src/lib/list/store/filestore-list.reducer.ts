import { createReducer, on } from '@ngrx/store';
import * as fromFilestoreListActions from './filestore-list.actions';
import { ListObjectsCommandOutput } from '@aws-sdk/client-s3';
import { LoadingStatus, SortOption } from '@jellyblog-nest/utils/common';
import { FileInfo } from './file-info';
import { availableSortOptions } from './filestore-sort-options';

export const filestoreListFeatureKey = 'filestoreList';

export interface State {
  prefix: string;
  delimiter: string;
  listObjectsCommandOutputs: ListObjectsCommandOutput[],
  loadingStatus: LoadingStatus,
  sort: SortOption<FileInfo>,
}

export const initialState: State = {
  delimiter: '/',
  prefix: '',
  listObjectsCommandOutputs: [],
  loadingStatus: LoadingStatus.INITIAL,
  sort: availableSortOptions[0],
};

export const reducer = createReducer(
  initialState,

  on(
    fromFilestoreListActions.beginBrowse,
    (state) => {
      return {
        ...state,
        loadingStatus: LoadingStatus.LOADING,
      };
    },
  ),

  on(
    fromFilestoreListActions.changeFolder,
    (state) => {
      return {
        ...state,
        loadingStatus: LoadingStatus.LOADING,
      };
    },
  ),

  on(
    fromFilestoreListActions.failListObjectsCommandOutput,
    (state) => {
      return {
        ...state,
        loadingStatus: LoadingStatus.FAILED,
      };
    },
  ),

  on(
    fromFilestoreListActions.gotListObjectsCommandOutput,
    (state, action) => {
      return {
        ...state,
        listObjectsCommandOutputs: [action.response],
        loadingStatus: action.response.IsTruncated
          ? state.loadingStatus
          : LoadingStatus.SUCCESS,
        prefix: action.response.Prefix || '',
      };
    },
  ),

  on(
    fromFilestoreListActions.gotNextListObjectsCommandOutput,
    (state, action) => {
      return {
        ...state,
        loadingStatus: action.response.IsTruncated
          ? state.loadingStatus
          : LoadingStatus.SUCCESS,
        listObjectsCommandOutputs: [
          ...state.listObjectsCommandOutputs,
          action.response,
        ],
      };
    },
  ),

  on(
    fromFilestoreListActions.changeSort,
    (state, action) => {
      return {
        ...state,
        sort: {
          ...action.sort,
        },
      };
    },
  ),

  on(
    fromFilestoreListActions.deleteObjectSuccess,
    (state, action) => {
      return {
        ...state,
        // Выпилить из стора инф. об удаленном файле
        listObjectsCommandOutputs: state.listObjectsCommandOutputs.map((output) => {
          return {
            ...output,
            Contents: output.Contents
              ? output.Contents.filter(fileObject => fileObject.Key !== action.key)
              : output.Contents,
          };
        }),
      };
    },
  ),

);
