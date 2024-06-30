import { AppRoute } from '@jellyblog-nest/utils/front';
import { PostRegComponent } from './reg/reg.component';

export const routes: AppRoute[] = [
  {
    path: '',
    redirectTo: 'reg',
    pathMatch: 'full',
  },
  {
    path: 'reg',
    component: PostRegComponent,
  },
];
