import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SortOrder } from './sort-order';

export class Sortable<TFields> {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  order?: Partial<Record<keyof TFields, SortOrder>>
}
