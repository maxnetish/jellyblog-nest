import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { NoPreloading, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthFrontModule } from '@jellyblog-nest/auth/front';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import * as GlobalToastReducer from './global-toast/store/global-toast.reducer';
import { shellAdminRoutes } from './shell-admin.routes';
import { NgIconsModule } from '@ng-icons/core';
import { heroBars3 } from '@ng-icons/heroicons/outline';
import { SettingsFrontModule } from '@jellyblog-nest/settings/front';

@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(shellAdminRoutes, {
      preloadingStrategy: NoPreloading,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
    StoreModule.forRoot({
      [GlobalToastReducer.globalToastFeatureKey]: GlobalToastReducer.reducer,
    }, {
      runtimeChecks: {
        strictActionImmutability: true,
        strictStateImmutability: true,
        strictActionTypeUniqueness: true,
        strictStateSerializability: true,
        strictActionWithinNgZone: true,
      },
    }),
    EffectsModule.forRoot([]),
    NgIconsModule.withIcons({
      heroBars3,
    }),
    AuthFrontModule,
    SettingsFrontModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi(), withFetch())],
})
export class ShellAdminModule {
}

export { LayoutComponent };
