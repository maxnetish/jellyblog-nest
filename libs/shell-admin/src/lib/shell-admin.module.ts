import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { NoPreloading, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppRoute } from '@jellyblog-nest/utils/front';
import { UserRole } from '@jellyblog-nest/utils/common';
import { InsufficientRightsComponent } from './insufficient-rights/insufficient-rights.component';
import { AuthFrontModule, AuthGuardNg } from '@jellyblog-nest/auth/front';
import { HttpClientModule } from '@angular/common/http';
import { GlobalToastComponent } from './global-toast/global-toast.component';
import * as GlobalToastReducer from './global-toast/store/global-toast.reducer';
import { NgbDropdownModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { UserWidgetComponent } from './user-widget/user-widget.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: AppRoute[] = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadChildren: async () => {
      try {
        const m = await import('@jellyblog-nest/users/front');
        return m.UsersFrontModule;
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    canActivate: [AuthGuardNg],
    data: {
      role: UserRole.ADMIN,
      redirectOptionsIfNoRole: {
        queryParams: {
          afterLogin: '/users',
        },
        queryParamsHandling: 'merge',
      },
    },
  },
  {
    path: 'insufficient-rights',
    component: InsufficientRightsComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
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
