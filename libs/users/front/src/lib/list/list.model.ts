import { UserRole } from '@jellyblog-nest/utils/common';

export interface SearchFormModel {
  name?: string;
  role?: UserRole[];
}
