import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromAuth from './store/auth.reducer';
import { AuthEffects } from './store/auth.effects';
import { AuthFacade } from './store/auth.facade';
import { LoginFormComponent } from './login-form/login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuardNg } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginFormModalService } from './login-form/login-form-modal.service';
import * as AuthActions from './store/auth.actions';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromAuth.AUTH_FEATURE_KEY, fromAuth.reducer),
    EffectsModule.forFeature([AuthEffects]),
    ReactiveFormsModule,
  ],
  providers: [AuthFacade, AuthService],
  declarations: [
    LoginFormComponent,
  ],
})
export class AuthFrontModule {
}

export {
  AuthFacade,
  AuthGuardNg,
  AuthService,
  LoginFormModalService,
  AuthActions,
};
