import { IsInt, IsOptional, Min } from 'class-validator';
import { Sortable } from './sortable';

export class Pageable<TFields> extends Sortable<TFields> {
  @IsInt()
  @Min(1)
  @IsOptional()
  page = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  size = 10;
}
