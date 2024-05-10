import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTagRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  @MinLength(2)
  content = '';
}
