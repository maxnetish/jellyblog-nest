import { createReducer, on } from '@ngrx/store';
import * as GlobalToastActions from './global-toast.actions';
import { GlobalToastModel } from '../global-toast.model';
import { GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';
import { nanoid } from 'nanoid';

export const globalToastFeatureKey = 'globalToast';

export interface State {
  toasts: GlobalToastModel[];
}

export const initialState: State = {
  toasts: [],
};


export const reducer = createReducer(
  initialState,

  on(
    GlobalActions.addGlobalToast,
    (state, action) => {
      console.log('GOT addGlobalToast ', action);
      const id = nanoid(8);
      return {
        ...state,
        toasts: [
          ...state.toasts,
          {
            id,
            severity: action.severity || GlobalToastSeverity.INFO,
            text: action.text,
          },
        ],
      };
    },
  ),

  on(
    GlobalToastActions.removeToast,
    (state, action) => {
      const ind = state.toasts.findIndex(t => t.id === action.id);
      return {
        ...state,
        toasts: ind > -1
          ? [
            ...state.toasts.slice(0, ind),
            ...state.toasts.slice(ind + 1),
          ]
          : state.toasts,
      };
    },
  ),
);
