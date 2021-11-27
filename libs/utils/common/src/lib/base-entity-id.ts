import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEntityId {
  @IsUUID()
  @ApiProperty({
    required: true,
    example: '95938507-d3cd-4045-92e0-d43d93e8f674'
  })
  uuid = '';
}
