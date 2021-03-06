import { AppRoute } from '@jellyblog-nest/utils/front';
import { AuthGuardNg } from '@jellyblog-nest/auth/front';
import { UserRole } from '@jellyblog-nest/utils/common';
import { SettingsFrontModule } from '@jellyblog-nest/settings/front';
import { InsufficientRightsComponent } from './insufficient-rights/insufficient-rights.component';
import { NotFoundComponent } from './not-found/not-found.component';

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
        return null;
      }
    },
    canActivate: [AuthGuardNg],
    data: {
      role: UserRole.ADMIN,
      redirectOptionsIfNoRole: {
        queryParams: {
          afterLogin: '/users',
        },
        queryParamsHandling: 'merge',
      },
    },
  },
  {
    path: 'settings',
    loadChildren: () => SettingsFrontModule,
    canActivate: [AuthGuardNg],
    data: {
      role: UserRole.ADMIN,
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
        return null;
      }
    },
    canActivate: [AuthGuardNg],
    data: {
      role: UserRole.ADMIN,
    },
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
