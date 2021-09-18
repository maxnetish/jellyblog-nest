import { EntitySchema } from '@mikro-orm/core';
import { User, UserRole } from '@jellyblog-nest/auth/model';
import { BaseEntity } from '@jellyblog-nest/models';

export const userSchema = new EntitySchema<User, BaseEntity>({
  name: 'User',
  extends: 'BaseEntity',
  properties: {
    username: { type: 'string' },
    secret: { type: 'string', nullable: false },
    role: { enum: true, items: () => UserRole, default: UserRole.READER },
    hashAlgo: { type: 'string', default: 'sha256' },
  },
  indexes: [
    {
      properties: ['username'],
    },
  ],
  uniques: [
    {
      properties: ['username'],
    },
  ],
});
