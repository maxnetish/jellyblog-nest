import { PostContentType, PostPermission, PostStatus } from '@jellyblog-nest/utils/common';
import { TagDto } from './tag-dto';
import { Type } from 'class-transformer';

export class PostDto {
  uuid?: string;
  status!: PostStatus;
  allowRead!: PostPermission;
  @Type(() => Date)
  pubDate?: Date | null;
  @Type(() => Date)
  createdAt!: Date;
  @Type(() => Date)
  updatedAt!: Date;
  author!: string;
  contentType!: PostContentType;
  title!: string;
  brief: string | null = null;
  content!: string;
  @Type(() => TagDto)
  tags: TagDto[] = [];
  titleImg: string | null = null;
  attachments: string[] = [];
  hru: string | null = null;
}

// export type PostDto = {
//   [key in keyof Post]: Post[key];
// }
