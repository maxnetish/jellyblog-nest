import {
  ChangeDetectionStrategy,
  Component,
  inject, input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AuthActions from './../store/auth.actions';
import { GlobalActions, GlobalToastSeverity, ValidationMessageComponent } from '@jellyblog-nest/utils/front';

type LoginFormGroup = FormGroup<{
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}>;

@Component({
  selector: 'app-auth-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ValidationMessageComponent,
  ],
})
export class LoginFormComponent {

  private readonly authService = inject(AuthService);
  private readonly store = inject(Store);
  protected readonly form: LoginFormGroup = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });
  readonly disallowCancel = input(false);
  readonly cancel = output();
  readonly successSubmit = output();

  protected cancelClick() {
    this.cancel.emit();
  }

  protected async submitForm() {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.value;
    if (!formValue) {
      return;
    }
    try {
      const result = await firstValueFrom(this.authService.login({
        username: formValue.username || '',
        password: formValue.password || '',
      }));
      this.store.dispatch(GlobalActions.addGlobalToast({
        severity: GlobalToastSeverity.SUCCESS,
        text: 'Logged in',
      }));
      this.store.dispatch(AuthActions.gotUserInfo({
        user: result || null,
      }));
      // После авторизации, дернем обновление справочников и настроек
      // this.store.dispatch(GlobalActions.loadApp());
      this.successSubmit.emit();
    } catch (err: any) {
      this.store.dispatch(GlobalActions.addGlobalToast({
        severity: GlobalToastSeverity.ERROR,
        text: err.message,
      }));
    }
  }
}
