import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Session } from './sesson.entity';
import { Setting } from './setting.entity';

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
};
