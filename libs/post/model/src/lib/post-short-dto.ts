import { BaseEntityId, PostPermission, PostStatus } from '@jellyblog-nest/utils/common';

export class PostShortDto extends BaseEntityId{
   createdAt: Date | string | number = '';
   status = PostStatus.DRAFT;
   allowRead = PostPermission.FOR_ALL;
   author = '';
   title = '';
   hru: string | null = null;
}
