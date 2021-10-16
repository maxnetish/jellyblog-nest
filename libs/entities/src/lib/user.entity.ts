import { BaseEntity } from './base.entity';
import { Column, Entity, Index } from 'typeorm';
import { UserRole } from '@jellyblog-nest/utils/common';

@Entity()
export class User extends BaseEntity {
  @Column()
  @Index({ unique: true })
  username!: string;

  @Column()
  secret!: string;

  @Column({ type: 'varchar' })
  role: UserRole = UserRole.READER;

  @Column({ type: 'varchar' })
  hashAlgo = 'sha256';
}
