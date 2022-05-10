import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Session } from './sesson.entity';
import { Setting } from './setting.entity';
import { Tag } from './tag.entity';
import { Post } from './post.entity';

export const allEntities = [
  User,
  Session,
  Setting,
];

export {
  BaseEntity,
  User,
  Session,
  Setting,
  Tag,
  Post,
};
