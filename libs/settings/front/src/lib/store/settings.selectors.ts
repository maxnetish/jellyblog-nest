import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSettings from './settings.reducer';

export const selectSettingsState = createFeatureSelector<fromSettings.State>(
  fromSettings.settingsFeatureKey,
);

export const selectSettings = createSelector(
  selectSettingsState,
  state => state.settings,
);

export const selectSettingsLoadingStatus = createSelector(
  selectSettingsState,
  state => state.settingsLoadingStatus,
);

export const selectSettingsUpdatingStatus = createSelector(
  selectSettingsState,
  state => state.settingsUpdatingStatus,
);
