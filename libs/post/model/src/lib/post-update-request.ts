import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PostContentType, PostPermission } from '@jellyblog-nest/utils/common';
import { TagDto } from './tag-dto';

export class PostUpdateRequest {

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
