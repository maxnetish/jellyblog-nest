import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class Sortable {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  order!: {
    [key in string]: 'ASC' | 'DESC';
  };
}
