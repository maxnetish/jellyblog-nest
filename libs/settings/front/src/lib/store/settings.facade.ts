import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as SettingsSelectors from './settings.selectors';
import * as SettingsActions from './settings.actions';
import { LoadingStatus, SettingName } from '@jellyblog-nest/utils/common';
import { combineLatest, filter, map, switchMap } from 'rxjs';
import { SettingDto } from '@jellyblog-nest/settings/model';
import { S3ClientConfig } from '@aws-sdk/client-s3';

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

  s3ClientConfig$ = combineLatest([
    this.getSetting$(SettingName.S3_ACCESS_KEY),
    this.getSetting$(SettingName.S3_ACCESS_SECRET),
    this.getSetting$(SettingName.S3_ENDPOINT),
    this.getSetting$(SettingName.S3_REGION),
  ]).pipe(
    map(([accessKeyId, secretAccessKey, endpoint, region]) => {
      return {
        endpoint,
        credentials: (accessKeyId && secretAccessKey)
          ? {
            accessKeyId,
            secretAccessKey,
          }
          : undefined,
        region,
      } as S3ClientConfig;
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
  }

  saveSetting(setting: SettingDto) {
    this.store.dispatch(SettingsActions.updateSetting({
      name: setting.name,
      value: setting.value,
    }));
  }

  loadSettings() {
    this.store.dispatch(SettingsActions.loadSettings());
  }

}
