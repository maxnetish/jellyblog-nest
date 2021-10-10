import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromAuth from './store/auth.reducer';
import { AuthEffects } from './store/auth.effects';
import { AuthFacade } from './store/auth.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromAuth.AUTH_FEATURE_KEY, fromAuth.reducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [AuthFacade],
})
export class AuthFrontModule {}

export {
  AuthFacade,
}
