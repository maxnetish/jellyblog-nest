import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class TagDto {
  uuid = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  @MinLength(2)
  content = '';
}
