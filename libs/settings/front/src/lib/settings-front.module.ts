import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import * as fromSettings from './store/settings.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SettingsEffects } from './store/settings.effects';
import { SettingsFacade } from './store/settings.facade';
import { SettingsService } from './settings.service';
import { EditFormComponent } from './edit-form/edit-form.component';
import { AppRoute } from '@jellyblog-nest/utils/front';
import { RouterModule } from '@angular/router';

const routes: AppRoute[] = [
  {
    path: 'edit',
    component: EditFormComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(
      fromSettings.settingsFeatureKey,
      fromSettings.reducer,
    ),
    EffectsModule.forFeature([
      SettingsEffects,
    ]),
  ],
  providers: [
  ],
  declarations: [
  ],
})
export class SettingsFrontModule {
}

export {
  SettingsFacade,
  SettingsService,
}
