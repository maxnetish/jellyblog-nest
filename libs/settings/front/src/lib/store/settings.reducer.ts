import { createReducer, on } from '@ngrx/store';
import * as SettingsActions from './settings.actions';
import { SettingDto } from '@jellyblog-nest/settings/model';
import { LoadingStatus } from '@jellyblog-nest/utils/common';

export const settingsFeatureKey = 'settings';

export interface State {
  settings: SettingDto[];
  settingsLoadingStatus: LoadingStatus;
  settingsUpdatingStatus: LoadingStatus;
}

export const initialState: State = {
  settings: [],
  settingsLoadingStatus: LoadingStatus.INITIAL,
  settingsUpdatingStatus: LoadingStatus.INITIAL,
};


export const reducer = createReducer(
  initialState,

  on(
    SettingsActions.loadSettings,
    (state) => {
      return {
        ...state,
        settingsLoadingStatus: LoadingStatus.LOADING,
      };
    },
  ),

  on(
    SettingsActions.gotSettings,
    (state, action) => {
      return {
        ...state,
        settingsLoadingStatus: LoadingStatus.SUCCESS,
        settings: [...action.settings],
      };
    },
  ),

  on(
    SettingsActions.failSettings,
    (state) => {
      return {
        ...state,
        settingsLoadingStatus: LoadingStatus.FAILED,
      };
    },
  ),

  on(
    SettingsActions.updateSetting,
    (state) => {
      return {
        ...state,
        settingsUpdatingStatus: LoadingStatus.LOADING,
      };
    },
  ),

  on(
    SettingsActions.successUpdateSetting,
    (state, action) => {
      const ind = state.settings.findIndex(setting => setting.name === action.name);
      const settings = [
        ...state.settings.slice(0, ind),
        {
          ...state.settings[ind],
          name: action.name,
          value: action.value,
        },
        ...state.settings.slice(ind + 1),
      ];
      return {
        ...state,
        settingsUpdatingStatus: LoadingStatus.SUCCESS,
        settings,
      }
    },
  ),

  on(
    SettingsActions.failUpdateSetting,
    (state) => {
      return {
        ...state,
        settingsUpdatingStatus: LoadingStatus.FAILED,
      };
    },
  ),
);

