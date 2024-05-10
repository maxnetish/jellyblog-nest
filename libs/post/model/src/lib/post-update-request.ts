import { Post } from '@jellyblog-nest/entities';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MAX,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PostContentType, PostPermission } from '@jellyblog-nest/utils/common';
import { TagDto } from './tag-dto';

export class PostUpdateRequest {
  @IsString()
  @IsUUID()
  @IsOptional()
  uuid?: string;

  @IsEnum(PostPermission)
  @IsDefined()
  allowRead = PostPermission.FOR_ALL;

  @IsEnum(PostContentType)
  @IsDefined()
  contentType = PostContentType.HTML;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  title = 'Title';

  @IsString()
  @IsOptional()
  @MaxLength(256)
  brief = null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(65536)
  content = 'Content';

  @IsArray({
    each: true,
  })
  tags: Partial<TagDto>[] = [];
}
