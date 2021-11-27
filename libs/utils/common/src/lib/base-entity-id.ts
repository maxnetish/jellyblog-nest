import { IsUUID } from 'class-validator';

export class BaseEntityId {
  @IsUUID()
  uuid = '';
}
