import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGlobalToast from './global-toast.reducer';

export const selectGlobalToastState = createFeatureSelector<fromGlobalToast.State>(
  fromGlobalToast.globalToastFeatureKey,
);

export const selectToasts = createSelector(
  selectGlobalToastState,
  state => state.toasts,
);
