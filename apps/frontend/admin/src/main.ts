import { enableProdMode, Sanitizer } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import {
  NoPreloading,
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { shellAdminRoutes, ToastReducer } from '@jellyblog-nest/shell-admin';
import { AuthEffects, AuthReducer } from '@jellyblog-nest/auth/front';
import {
  SettingsEffects,
  SettingsReducer,
} from '@jellyblog-nest/settings/front';
import { NgDompurifySanitizer } from '@taiga-ui/dompurify';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideStore(
      {
        [ToastReducer.globalToastFeatureKey]: ToastReducer.reducer,
        [AuthReducer.AUTH_FEATURE_KEY]: AuthReducer.reducer,
        [SettingsReducer.settingsFeatureKey]: SettingsReducer.reducer,
      },
      {
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
          strictActionTypeUniqueness: true,
          strictStateSerializability: true,
          strictActionWithinNgZone: true,
        },
      }
    ),
    provideEffects([AuthEffects, SettingsEffects]),
    provideRouter(
      shellAdminRoutes,
      withPreloading(NoPreloading),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),
    provideHttpClient(withFetch()),
    {
      // We use dompurify sanitizer instead of angular sanitizer
      provide: Sanitizer,
      useClass: NgDompurifySanitizer,
    },
  ],
})
  .then(() => {
    if (!environment.production) {
      console.log('Application started');
    }
  })
  .catch((err) => console.error('Cannot bootstrap application: ', err));
