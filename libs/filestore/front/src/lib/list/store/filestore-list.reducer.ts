import { createReducer, on } from '@ngrx/store';
import * as fromFilestoreListActions from './filestore-list.actions';
import { ListObjectsCommandOutput } from '@aws-sdk/client-s3';
import { LoadingStatus } from '@jellyblog-nest/utils/common';
import { beginBrowse } from './filestore-list.actions';

export const filestoreListFeatureKey = 'filestoreList';

export interface State {
  prefix: string;
  delimiter: string;
  listObjectsCommandOutputs: ListObjectsCommandOutput[],
  loadingStatus: LoadingStatus,
}

export const initialState: State = {
  delimiter: '/',
  prefix: '',
  listObjectsCommandOutputs: [],
  loadingStatus: LoadingStatus.INITIAL,
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
        loadingStatus: LoadingStatus.SUCCESS,
        prefix: action.response.Prefix || '',
      };
    },
  ),

  on(
    fromFilestoreListActions.continueBrowse,
    (state) => {
      return {
        ...state,
        loadingStatus: LoadingStatus.LOADING,
      };
    },
  ),

  on(
    fromFilestoreListActions.gotNextListObjectsCommandOutput,
    (state, action) => {
      return {
        ...state,
        loadingStatus: LoadingStatus.SUCCESS,
        listObjectsCommandOutputs: [
          ...state.listObjectsCommandOutputs,
          action.response,
        ],
      };
    },
  ),

);
