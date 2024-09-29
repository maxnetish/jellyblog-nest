import { EditFormComponent } from './edit-form/edit-form.component';
import { AppRoute } from '@jellyblog-nest/utils/front';

export const SettingsRoutes: AppRoute[] = [
  {
    path: 'edit',
    component: EditFormComponent,
  },
];
