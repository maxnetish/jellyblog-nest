import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromSettings from './store/settings.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SettingsEffects } from './store/settings.effects';
import { SettingsFacade } from './store/settings.facade';
import { SettingsService } from './settings.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromSettings.settingsFeatureKey,
      fromSettings.reducer,
    ),
    EffectsModule.forFeature([
      SettingsEffects,
    ]),
  ],
  providers: [
    SettingsFacade,
    SettingsService,
  ],
})
export class SettingsFrontModule {
}

export {
  SettingsFacade,
  SettingsService,
}
