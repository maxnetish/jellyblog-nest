import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromSettings from './store/settings.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SettingsEffects } from './store/settings.effects';
import { SettingsFacade } from './store/settings.facade';
import { SettingsService } from './settings.service';
import { EditFormComponent } from './edit-form/edit-form.component';
import { AppRoute, UtilsFrontModule } from '@jellyblog-nest/utils/front';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import {
  HeroPencil,
  HeroUpload,
} from '@ng-icons/heroicons';
import { UtilsFrontFileUploaderModule } from '@jellyblog-nest/utils/front-file-uploader';
import { CheckFileStoreComponent } from './edit-form/check-file-store/check-file-store.component';

const routes: AppRoute[] = [
  {
    path: 'edit',
    component: EditFormComponent,
  },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        StoreModule.forFeature(
            fromSettings.settingsFeatureKey,
            fromSettings.reducer,
        ),
        EffectsModule.forFeature([
            SettingsEffects,
        ]),
        ReactiveFormsModule,
        NgIconsModule.withIcons({
            HeroPencil,
            HeroUpload,
        }),
        UtilsFrontFileUploaderModule,
        UtilsFrontModule,
    ],
  providers: [
    SettingsFacade,
    SettingsService,
  ],
  declarations: [
    EditFormComponent,
    CheckFileStoreComponent
  ],
})
export class SettingsFrontModule {
}

export {
  SettingsFacade,
  SettingsService,
}
