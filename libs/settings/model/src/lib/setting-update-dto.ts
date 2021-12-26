import { SettingName } from '@jellyblog-nest/utils/common';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SettingUpdateDto {
  @IsEnum(SettingName)
  @IsNotEmpty()
  name?: SettingName;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  value?: string;
}
