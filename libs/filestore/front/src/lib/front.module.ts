import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilestoreListComponent } from './list/list.component';
import { AppRoute, UtilsFrontModule } from '@jellyblog-nest/utils/front';
import { RouterModule } from '@angular/router';
import * as fromFilestoreListReducer from './list/store/filestore-list.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FilestoreListEffects } from './list/store/filestore-list.effects';
import { FilestorelistFacade } from './list/store/filestore-list.facade';
import { HeroArrowSmUp, HeroFolder } from '@ng-icons/heroicons';
import { NgIconsModule } from '@ng-icons/core';
import { ListItemComponent } from './list/list-item/list-item.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

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
        CommonModule,
        RouterModule.forChild(routes),
        StoreModule.forFeature(
            fromFilestoreListReducer.filestoreListFeatureKey,
            fromFilestoreListReducer.reducer,
        ),
        EffectsModule.forFeature([
            FilestoreListEffects,
        ]),
        NgIconsModule.withIcons({
            HeroArrowSmUp,
            HeroFolder,
        }),
        NgbCollapseModule,
        UtilsFrontModule,
    ],
  declarations: [
    FilestoreListComponent,
    ListItemComponent,
  ],
  providers: [
    FilestorelistFacade,
  ],
})
export class FilestoreFrontModule {
}
