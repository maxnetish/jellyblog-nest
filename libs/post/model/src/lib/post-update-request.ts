import {
  ArrayNotEmpty,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength, ValidateNested,
} from 'class-validator';
import { PostContentType, PostPermission } from '@jellyblog-nest/utils/common';
import { TagDto } from './tag-dto';
import { Type } from 'class-transformer';

export class PostUpdateRequest {

  @IsEnum(PostPermission)
  @IsDefined()
  allowRead!: PostPermission;

  @IsEnum(PostContentType)
  @IsDefined()
  contentType!: PostContentType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  brief?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(65536)
  content!: string;

  @ValidateNested({
    each: true,
  })
  @Type(() => TagDto)
  tags!: TagDto[];
}
