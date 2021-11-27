import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UserRole } from '@jellyblog-nest/utils/common';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  username = '';

  @IsEnum(UserRole)
  role = UserRole.READER;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  password = '';
}
