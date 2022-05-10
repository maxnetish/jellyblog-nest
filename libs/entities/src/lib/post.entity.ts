import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { PostContentType, PostPermission, PostStatus } from '@jellyblog-nest/utils/common';
import { BaseEntity } from './base.entity';
import { Tag } from './tag.entity';

@Entity()
export class Post extends BaseEntity {

  @Column({type: 'varchar'})
  status: PostStatus = PostStatus.DRAFT;

  @Column({type: 'varchar'})
  allowRead: PostPermission = PostPermission.FOR_ALL;

  @Column({type: 'datetime'})
  pubDate!: Date;

  @Column()
  author!: string;

  @Column({type: 'varchar'})
  contentType: PostContentType = PostContentType.HTML;

  @Column()
  title!: string;

  @Column({nullable: true})
  brief: string | null = null;

  @Column()
  content!: string;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  /**
   * there is key from s3 srorage
   */
  @Column({nullable: true})
  titleImg: string | null = null;

  /**
   * there are keys from s3 storage
   */
  @Column('simple-array')
  attachments: string[] = [];

  /**
   * Human-readable-url
   */
  @Column({nullable: true})
  @Index({unique: false})
  hru: string | null = null;
}
