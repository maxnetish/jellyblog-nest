import { BaseEntity } from './base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity()
export class Tag extends BaseEntity {
  @Column()
  @Index({unique: true})
  content!: string;
}
