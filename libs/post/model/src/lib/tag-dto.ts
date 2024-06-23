import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class TagDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  uuid?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  @MinLength(2)
  content!: string;
}
