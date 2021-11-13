import { UserRole } from '@jellyblog-nest/utils/common';

export class UserInfoDto {
  uuid = '';
  username = '';
  role = UserRole.READER;
}
