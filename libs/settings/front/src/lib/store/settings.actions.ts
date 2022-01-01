import { createAction, props } from '@ngrx/store';
import { SettingDto } from '@jellyblog-nest/settings/model';
import { SettingName } from '@jellyblog-nest/utils/common';

export const loadSettings = createAction(
  '[Settings] Load Settings',
);

export const gotSettings = createAction(
  '[Settings] Got settings',
  props<{ settings: SettingDto[] }>(),
);

export const failSettings = createAction(
  '[Settings] Fail settings',
  props<{ err: any }>(),
);

export const updateSetting = createAction(
  '[Settings] Update settings',
  props<{ name: SettingName, value?: string }>(),
);

export const successUpdateSetting = createAction(
  '[Settings] success update setting',
  props<{ name: SettingName, value?: string }>(),
);

export const failUpdateSetting = createAction(
  '[Settings] fail update setting',
  props<{ err: any }>(),
);
