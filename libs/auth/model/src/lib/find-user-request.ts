import { UserRole } from '@jellyblog-nest/utils/common';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Pageable } from '@jellyblog-nest/utils/common';
import { UserInfoDto } from './user-info-dto';

export class FindUserRequest extends Pageable<Omit<UserInfoDto, 'uuid'>> {
  @IsString()
  @MaxLength(128)
  @IsOptional()
  name?: string;

  @IsEnum(UserRole, { each: true })
  role?: UserRole[] = [];
}
