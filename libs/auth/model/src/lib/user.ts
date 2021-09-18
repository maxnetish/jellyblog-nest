import { UserRole } from './user-role';
import { BaseEntity } from '@jellyblog-nest/models';

export interface User extends BaseEntity{
  username: string;
  role: UserRole;
  secret: string;
  /**
   * One of algorythm
   * List of algo, supported on platform: openssl list -digest-algorithms
   * For example 'sha256'
   */
  hashAlgo: string;
}

