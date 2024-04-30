import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { NoPreloading, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InsufficientRightsComponent } from './insufficient-rights/insufficient-rights.component';
import { AuthFrontModule } from '@jellyblog-nest/auth/front';
import { HttpClientModule } from '@angular/common/http';
import { GlobalToastComponent } from './global-toast/global-toast.component';
import * as GlobalToastReducer from './global-toast/store/global-toast.reducer';
import { NgbCollapseModule, NgbDropdownModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { UserWidgetComponent } from './user-widget/user-widget.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { shellAdminRoutes } from './shell-admin.routes';
import { LoginPageComponent } from './login-page/login-page.component';
import { NgIconsModule } from '@ng-icons/core';
import { heroBars3 } from '@ng-icons/heroicons/outline';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(shellAdminRoutes, {
      preloadingStrategy: NoPreloading,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
    StoreModule.forRoot(
      {
        [GlobalToastReducer.globalToastFeatureKey]: GlobalToastReducer.reducer,
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
    EffectsModule.forRoot([]),
    NgIconsModule.withIcons({
      heroBars3,
    }),
    HttpClientModule,
    AuthFrontModule,
    NgbToastModule,
    NgbDropdownModule,
    NgbCollapseModule,
  ],
  declarations: [
    LayoutComponent,
    InsufficientRightsComponent,
    GlobalToastComponent,
    UserWidgetComponent,
    NotFoundComponent,
    LoginPageComponent,
  ],
  exports: [LayoutComponent],
})
export class ShellAdminModule {}

export { LayoutComponent };
