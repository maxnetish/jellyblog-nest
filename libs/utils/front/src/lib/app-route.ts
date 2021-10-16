import { Data, Route, UrlCreationOptions } from '@angular/router';
import { UserRole } from '@jellyblog-nest/utils/common';

export interface AppRoute extends Route {
  data?: Data & {
    role?: UserRole | UserRole[],
    redirectCommandsIfNoRole?: string[],
    redirectOptionsIfNoRole?: UrlCreationOptions,
  };
}
