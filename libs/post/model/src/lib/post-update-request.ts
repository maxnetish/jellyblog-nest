import { Post } from '@jellyblog-nest/entities';
import {
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

// export type PostUpdateRequest = Post | Omit<Post, 'uuid'>

export class PostUpdateRequest implements Partial<Post>{
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

  // TODO make dto for many-to-many relation
  tags = [];
}
