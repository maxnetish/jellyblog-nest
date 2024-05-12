import { PostContentType, PostPermission, PostStatus } from '@jellyblog-nest/utils/common';
import { TagDto } from './tag-dto';
import { Type } from 'class-transformer';
import { Post } from '@jellyblog-nest/entities';

// export class PostDto {
//   uuid = '';
//   status: PostStatus = PostStatus.DRAFT;
//   allowRead: PostPermission = PostPermission.FOR_ALL;
//   @Type(() => Date)
//   pubDate!: Date;
//   @Type(() => Date)
//   createdAt!: Date;
//   @Type(() => Date)
//   updatedAt!: Date;
//   author!: string;
//   contentType: PostContentType = PostContentType.HTML;
//   title!: string;
//   brief: string | null = null;
//   content!: string;
//   @Type(() => TagDto)
//   tags: TagDto[] = [];
//   titleImg: string | null = null;
//   attachments: string[] = [];
//   hru: string | null = null;
// }

export type PostDto = {
  [key in keyof Post]: Post[key];
}
