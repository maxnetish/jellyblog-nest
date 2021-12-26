import { SettingName } from '@jellyblog-nest/utils/common';

export interface SettingDto {
  name: SettingName;
  value?: string;
  description: string;
  label: string;
}
