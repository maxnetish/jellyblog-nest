import { IsOptional } from 'class-validator';
import { SortOrder } from './sort-order';

export class Sortable<TFields> {
  @IsOptional()
  order?: Partial<Record<keyof TFields, SortOrder>>
}
