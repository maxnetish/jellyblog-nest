import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Sortable } from './sortable';

export class Pageable<TFields> extends Sortable<TFields> {
  @ApiProperty({
    example: 1,
    required: false,
    type: Number,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  page = 1;

  @ApiProperty({
    example: 10,
    required: false,
    type: Number,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  size = 10;
}
