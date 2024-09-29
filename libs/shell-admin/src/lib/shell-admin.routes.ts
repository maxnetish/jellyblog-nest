import { AppRoute } from '@jellyblog-nest/utils/front';
import { AuthGuardNg } from '@jellyblog-nest/auth/front';
import { UserRole } from '@jellyblog-nest/utils/common';
import { InsufficientRightsComponent } from './insufficient-rights/insufficient-rights.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SettingsRoutes } from '@jellyblog-nest/settings/front';

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
        return m.UserRoutes;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    canActivate: [AuthGuardNg],
    data: {
      role: UserRole.ADMIN,
    },
  },
  {
    path: 'post',
    loadChildren: async () => {
      try {
        const m = await import('@jellyblog-nest/post/front');
        return m.PostRoutes;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    canActivate: [AuthGuardNg],
    data: {
      role: UserRole.ADMIN,
    },
  },
  {
    path: 'settings',
    loadChildren: () => SettingsRoutes,
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
        return m.FilestoreRoutes;
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
