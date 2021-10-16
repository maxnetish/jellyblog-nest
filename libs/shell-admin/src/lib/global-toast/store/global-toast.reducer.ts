import { Action, createReducer, on } from '@ngrx/store';
import * as GlobalToastActions from './global-toast.actions';

export const globalToastFeatureKey = 'globalToast';

export interface State {

}

export const initialState: State = {

};


export const reducer = createReducer(
  initialState,

  on(GlobalToastActions.loadGlobalToasts, state => state),

);

