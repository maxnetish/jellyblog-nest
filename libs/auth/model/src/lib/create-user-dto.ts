import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '@jellyblog-nest/utils/common';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  @MinLength(3)
  username = '';

  @IsEnum(UserRole)
  @IsNotEmpty()
  role = UserRole.READER;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  @MinLength(8)
  password = '';
}
