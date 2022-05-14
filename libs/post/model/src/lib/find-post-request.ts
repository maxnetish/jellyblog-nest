import { PostShortDto } from './post-short-dto';
import { Pageable, PostPermission, PostStatus } from '@jellyblog-nest/utils/common';
import { IsDate, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class FindPostRequest extends Pageable<PostShortDto> {
  @IsDate()
  @IsOptional()
  createdAtFrom?: Date;

  @IsDate()
  @IsOptional()
  createdAtTo?: Date;

  @IsEnum(PostStatus, {each: true})
  @IsOptional()
  status?: PostStatus[];

  @IsEnum(PostPermission, {each: true})
  @IsOptional()
  allowRead?: PostPermission[];

  @IsString()
  @MaxLength(128)
  @IsOptional()
  text?: string;
}
