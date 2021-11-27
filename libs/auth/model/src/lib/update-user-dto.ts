import { UserRole } from '@jellyblog-nest/utils/common';
import { IsEnum, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MaxLength(128)
  @IsUUID()
  uuid = '';

  @IsEnum(UserRole)
  role = UserRole.READER;
}
