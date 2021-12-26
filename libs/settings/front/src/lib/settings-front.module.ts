import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromSettings from './store/settings.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SettingsEffects } from './store/settings.effects';
import { SettingsFacade } from './store/settings.facade';
import { SettingsService } from './settings.service';
import { EditFormComponent } from './edit-form/edit-form.component';
import { AppRoute } from '@jellyblog-nest/utils/front';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

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
  ],
  providers: [
    SettingsFacade,
    SettingsService,
  ],
  declarations: [
    EditFormComponent
  ],
})
export class SettingsFrontModule {
}

export {
  SettingsFacade,
  SettingsService,
}
