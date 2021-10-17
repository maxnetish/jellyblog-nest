import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AuthActions from './../store/auth.actions';
import { GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';

interface LoginFormModel {
  username: string;
  password: string;
}

@Component({
  selector: 'app-auth-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {

  private fb: IFormBuilder;
  form: IFormGroup<LoginFormModel>;

  constructor(
    formBuilder: FormBuilder,
    private readonly modal: NgbActiveModal,
    private readonly authService: AuthService,
    private readonly store: Store,
  ) {
    this.fb = formBuilder;

    this.form = this.fb.group<LoginFormModel>({
      username: [null],
      password: [null],
    });
  }

  cancelClick() {
    this.modal.dismiss('cancel');
  }

  async submitForm() {
    const formValue = this.form.value;
    if (!formValue) {
      return;
    }
    try {
      const result = await firstValueFrom(this.authService.login({
        username: formValue.username,
        password: formValue.password,
      }));
      this.store.dispatch(GlobalActions.addGlobalToast({
        severity: GlobalToastSeverity.SUCCESS,
        text: 'Logged in',
      }));
      this.store.dispatch(AuthActions.gotUserInfo({
        user: result || null,
      }));
      this.modal.close(result);
    } catch (err) {
      this.store.dispatch(GlobalActions.addGlobalToast({
        severity: GlobalToastSeverity.ERROR,
        text: err.message,
      }));
    }
  }

}
