import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class SetPasswordDto {
  @IsString()
  @MaxLength(128)
  @IsUUID()
  userId = '';

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  @MinLength(8)
  newPassword = '';
}
