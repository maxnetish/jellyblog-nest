import { EntitySchema } from '@mikro-orm/core';
import { BaseEntity } from '@jellyblog-nest/models';
import { v4 } from 'uuid';

export const baseEntitySchema = new EntitySchema<BaseEntity>({
  name: 'BaseEntity',
  abstract: true,
  properties: {
    id: { type: 'uuid', onCreate: () => v4(), primary: true },
    createdAt: { type: 'Date', onCreate: () => new Date(), nullable: true },
    updatedAt: { type: 'Date', onCreate: () => new Date(), onUpdate: () => new Date(), nullable: true },
  },
});
