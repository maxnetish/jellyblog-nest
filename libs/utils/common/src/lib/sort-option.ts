import { SortOrder } from '@jellyblog-nest/utils/common';

export interface SortOption<Entity> {
  label: string,
  field: keyof Entity,
  order: SortOrder,
}
