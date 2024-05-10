import { BaseEntity } from './base.entity';
import { Column, Entity, Index, ManyToMany } from 'typeorm';
import { Post } from '@jellyblog-nest/entities';

@Entity()
export class Tag extends BaseEntity {
  @Column()
  @Index({unique: true})
  content!: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
