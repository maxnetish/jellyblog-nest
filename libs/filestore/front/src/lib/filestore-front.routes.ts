import { AppRoute } from '@jellyblog-nest/utils/front';
import { FilestoreListComponent } from './list/list.component';
import { provideState } from '@ngrx/store';
import * as fromFilestoreListReducer from './list/store/filestore-list.reducer';
import { provideEffects } from '@ngrx/effects';
import { FilestoreListEffects } from './list/store/filestore-list.effects';
import { FilestorelistFacade } from './list/store/filestore-list.facade';

export const FilestoreRoutes: AppRoute[] = [
  {
    path: '',
    redirectTo: 'dir',
    pathMatch: 'full',
  },
  {
    path: 'dir',
    component: FilestoreListComponent,
    providers: [
      provideState(
        fromFilestoreListReducer.filestoreListFeatureKey,
        fromFilestoreListReducer.reducer,
      ),
      provideEffects([
        FilestoreListEffects,
      ]),
      FilestorelistFacade,
    ],
  },
];
