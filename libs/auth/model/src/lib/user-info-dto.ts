import { UserRole } from '@jellyblog-nest/auth/model';

export interface UserInfoDto{
  uuid: string;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
  username: string;
  role: UserRole;
}
