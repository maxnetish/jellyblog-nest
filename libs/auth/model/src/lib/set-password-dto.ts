import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class SetPasswordDto {
  @IsString()
  @MaxLength(128)
  @IsUUID()
  userId = '';

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  newPassword = '';
}
