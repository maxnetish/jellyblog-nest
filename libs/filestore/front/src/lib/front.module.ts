import { NgModule } from '@angular/core';
import { FilestoreListComponent } from './list/list.component';
import {
  AppRoute,
} from '@jellyblog-nest/utils/front';
import { RouterModule } from '@angular/router';
import * as fromFilestoreListReducer from './list/store/filestore-list.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FilestoreListEffects } from './list/store/filestore-list.effects';
import { FilestorelistFacade } from './list/store/filestore-list.facade';

const routes: AppRoute[] = [
  {
    path: '',
    redirectTo: 'dir',
    pathMatch: 'full',
  },
  {
    path: 'dir',
    component: FilestoreListComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(
      fromFilestoreListReducer.filestoreListFeatureKey,
      fromFilestoreListReducer.reducer,
    ),
    EffectsModule.forFeature([
      FilestoreListEffects,
    ]),
  ],
  declarations: [
  ],
  providers: [
    FilestorelistFacade,
  ],
})
export class FilestoreFrontModule {
}
