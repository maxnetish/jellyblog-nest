import { BaseEntityId, PostPermission, PostStatus } from '@jellyblog-nest/utils/common';
import { TagDto } from './tag-dto';

export class PostShortDto extends BaseEntityId{
   createdAt: Date | string | number = '';
   status = PostStatus.DRAFT;
   allowRead = PostPermission.FOR_ALL;
   author = '';
   title = '';
   hru: string | null = null;
   tags: TagDto[] = [];
}
