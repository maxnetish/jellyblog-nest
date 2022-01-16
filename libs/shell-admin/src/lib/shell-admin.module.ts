import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { NoPreloading, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InsufficientRightsComponent } from './insufficient-rights/insufficient-rights.component';
import { AuthFrontModule, AuthGuardNg } from '@jellyblog-nest/auth/front';
import { HttpClientModule } from '@angular/common/http';
import { GlobalToastComponent } from './global-toast/global-toast.component';
import * as GlobalToastReducer from './global-toast/store/global-toast.reducer';
import { NgbDropdownModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { UserWidgetComponent } from './user-widget/user-widget.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SettingsFrontModule } from '@jellyblog-nest/settings/front';
import { shellAdminRoutes } from './shell-admin.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(shellAdminRoutes, {
      preloadingStrategy: NoPreloading,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      // TODO: calc scroll offset: height of fixed elements
      // scrollOffset:
      relativeLinkResolution: 'legacy',
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
    HttpClientModule,
    AuthFrontModule,
    SettingsFrontModule,
    NgbToastModule,
    NgbDropdownModule,
  ],
  declarations: [
    LayoutComponent,
    InsufficientRightsComponent,
    GlobalToastComponent,
    UserWidgetComponent,
    NotFoundComponent,
  ],
  exports: [
    LayoutComponent,
  ],
})
export class ShellAdminModule {
}

export {
  LayoutComponent,
};
