import { SortOrder } from './sort-order';

export interface SortOption<Entity> {
  label: string,
  field: keyof Entity,
  order: SortOrder,
}
