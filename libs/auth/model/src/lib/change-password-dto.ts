import { CredentialsDto } from './credentials-dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangePasswordDto extends CredentialsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  newPassword: string;
}
