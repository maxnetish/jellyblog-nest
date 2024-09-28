import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilestoreListComponent } from './list/list.component';
import {
  AppendResponseContentDispositionPipe,
  AppRoute,
  CollapseTitleComponent, HumanFileSizePipe, NativeDatePipe,
  S3FileUrlPipe,
} from '@jellyblog-nest/utils/front';
import { RouterModule } from '@angular/router';
import * as fromFilestoreListReducer from './list/store/filestore-list.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FilestoreListEffects } from './list/store/filestore-list.effects';
import { FilestorelistFacade } from './list/store/filestore-list.facade';
import {
  heroArrowSmallUp,
  heroFolder,
  heroChevronRight,
  heroChevronDown,
  heroBarsArrowDown,
  heroBarsArrowUp,
  heroArrowTopRightOnSquare,
  heroCloudArrowDown,
  heroPencil,
  heroXMark,
  heroDocumentDuplicate,
  heroClipboard,
  heroGlobeAlt,
  heroCheck,
  heroCloudArrowUp,
} from '@ng-icons/heroicons/outline';
import { NgIconsModule } from '@ng-icons/core';
import { ListItemComponent } from './list/list-item/list-item.component';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LetDirective, PushPipe } from '@ngrx/component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadFormComponent } from './list/upload-form/upload-form.component';
import { UtilsFrontFileUploaderModule } from '@jellyblog-nest/utils/front-file-uploader';

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
      heroArrowSmallUp,
      heroFolder,
      heroChevronRight,
      heroChevronDown,
      heroBarsArrowDown,
      heroBarsArrowUp,
      heroArrowTopRightOnSquare,
      heroCloudArrowDown,
      heroPencil,
      heroXMark,
      heroDocumentDuplicate,
      heroGlobeAlt,
      heroCheck,
      heroCloudArrowUp,
      heroClipboard,
    }),
    NgbCollapseModule,
    NgbDropdownModule,
    LetDirective, PushPipe,
    FormsModule,
    ReactiveFormsModule,
    UtilsFrontFileUploaderModule,
    CollapseTitleComponent, S3FileUrlPipe, AppendResponseContentDispositionPipe, HumanFileSizePipe, NativeDatePipe,
    ListItemComponent,
    UploadFormComponent,
  ],
  declarations: [
    FilestoreListComponent,
  ],
  providers: [
    FilestorelistFacade,
  ],
})
export class FilestoreFrontModule {
}
