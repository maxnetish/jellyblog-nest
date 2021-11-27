import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CredentialsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  username = '';

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  password = '';
}
