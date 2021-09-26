import { UserRole } from './user-role';
import { IsEnum, IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  username: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  password: string;
}
