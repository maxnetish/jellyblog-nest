import { Post } from '@jellyblog-nest/entities';
import { PostPermission, PostStatus } from '@jellyblog-nest/utils/common';
import { UserInfoDto } from '@jellyblog-nest/auth/model';

/**
 * detect post permissions for user
 */
export function canViewPost({postEntity, user}: {postEntity: Post; user: UserInfoDto}) {
  // detect post permissions for current user
  let permit = false;
  // by post status
  switch (postEntity.status) {
    case PostStatus.DRAFT: {
      // only author can see draft
      permit = user && postEntity.author === user.username;
      break;
    }
    case PostStatus.PUB: {
      switch (postEntity.allowRead) {
        case PostPermission.FOR_ALL: {
          permit = true;
          break;
        }
        case PostPermission.FOR_REGISTERED: {
          permit = !!user;
          break;
        }
        case PostPermission.FOR_ME: {
          permit = user && postEntity.author === user.username;
          break;
        }
      }
      break;
    }
  }
  return permit;
}
