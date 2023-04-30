import { AppRoute } from '@jellyblog-nest/utils/front';
import { AuthGuardNg } from '@jellyblog-nest/auth/front';
import { UserRole } from '@jellyblog-nest/utils/common';
import { SettingsFrontModule } from '@jellyblog-nest/settings/front';
import { InsufficientRightsComponent } from './insufficient-rights/insufficient-rights.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginPageComponent } from './login-page/login-page.component';

export const shellAdminRoutes: AppRoute[] = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadChildren: async () => {
      try {
        const m = await import('@jellyblog-nest/users/front');
        return m.UsersFrontModule;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    canActivate: [AuthGuardNg],
    data: {
      role: UserRole.ADMIN,
      // redirectOptionsIfNoRole: {
      //   queryParams: {
      //     afterLogin: '/users',
      //   },
      //   queryParamsHandling: 'merge',
      // },
    },
  },
  {
    path: 'settings',
    loadChildren: () => SettingsFrontModule,
    canActivate: [AuthGuardNg],
    data: {
      role: UserRole.ADMIN,
      // redirectOptionsIfNoRole: {
      //   queryParams: {
      //     afterLogin: '/settings/edit',
      //   },
      //   queryParamsHandling: 'merge',
      // },
    },
  },
  {
    path: 'files',
    loadChildren: async () => {
      try {
        const m = await import('@jellyblog-nest/filestore/front');
        return m.FilestoreFrontModule;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    canActivate: [AuthGuardNg],
    data: {
      role: UserRole.ADMIN,
      // redirectOptionsIfNoRole: {
      //   queryParams: {
      //     afterLogin: '/files',
      //   },
      //   queryParamsHandling: 'merge',
      // },
    },
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'insufficient-rights',
    component: InsufficientRightsComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
