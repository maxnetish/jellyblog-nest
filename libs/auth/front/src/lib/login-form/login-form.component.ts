import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AuthActions from './../store/auth.actions';
import { GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';

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
})
export class LoginFormComponent {

  form: LoginFormGroup = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });

  @Input() disallowCancel = false;
  @Output() cancel = new EventEmitter();
  @Output() successSubmit = new EventEmitter();

  constructor(
    private readonly authService: AuthService,
    private readonly store: Store,
  ) {
  }

  cancelClick() {
    this.cancel.emit();
  }

  async submitForm() {
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
      this.successSubmit.emit();
    } catch (err: any) {
      this.store.dispatch(GlobalActions.addGlobalToast({
        severity: GlobalToastSeverity.ERROR,
        text: err.message,
      }));
    }
  }

}
