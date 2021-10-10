import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { NoPreloading, Route, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

const routes: Route[] = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadChildren: async () => {
      try {
        console.log('import async')
        const m = await import('@jellyblog-nest/users/front');
        return m.UsersFrontModule;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  }
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
    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictActionImmutability: true,
        strictStateImmutability: true,
        strictActionTypeUniqueness: true,
        strictStateSerializability: true,
        strictActionWithinNgZone: true,
      },
    }),
    EffectsModule.forRoot(),
  ],
  declarations: [
    LayoutComponent
  ],
  exports: [
    LayoutComponent
  ],
})
export class ShellAdminModule {}

export {
  LayoutComponent,
}
