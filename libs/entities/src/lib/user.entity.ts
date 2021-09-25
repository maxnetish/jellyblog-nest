import { UserRole } from '@jellyblog-nest/auth/model';
import { BaseEntity } from './base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  @Index({ unique: true })
  username!: string;

  @Column()
  secret!: string;

  @Column({ type: 'varchar' })
  role: UserRole = UserRole.READER;

  @Column()
  hashAlgo: string = 'sha256';
}
