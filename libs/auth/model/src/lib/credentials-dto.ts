import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CredentialsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  password: string;
}
