import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as SettingsSelectors from './settings.selectors';
import * as SettingsActions from './settings.actions';
import { LoadingStatus, SettingName } from '@jellyblog-nest/utils/common';
import { filter, map, switchMap } from 'rxjs';
import { SettingDto } from '@jellyblog-nest/settings/model';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacade {

  constructor(
    private readonly store: Store,
  ) {
  }

  settingsStatus$ = this.store.select(SettingsSelectors.selectSettingsLoadingStatus);

  settings$ = this.settingsStatus$.pipe(
    filter((settingsStatus) => {
      return [LoadingStatus.SUCCESS, LoadingStatus.FAILED].indexOf(settingsStatus) > -1;
    }),
    switchMap(() => {
      return this.store.select(SettingsSelectors.selectSettings);
    }),
  );

  getSetting$(settingName: SettingName) {
    return this.settings$.pipe(
      map((settings) => {
        const found = settings.find(setting => setting.name === settingName);
        if (found) {
          return found.value;
        }
        return null;
      }),
    );
  };

  saveSetting(setting: SettingDto) {
   this.store.dispatch(SettingsActions.updateSetting({
     name: setting.name,
     value: setting.value,
   }));
  }

}
