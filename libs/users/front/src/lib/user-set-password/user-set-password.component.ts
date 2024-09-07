import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  signal,
  effect,
  inject,
} from '@angular/core';
import { SetPasswordDto } from '@jellyblog-nest/auth/model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  AppValidators,
  GlobalActions,
  GlobalToastSeverity,
  ModalContentComponent,
  ValidationMessageComponent,
} from '@jellyblog-nest/utils/front';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@jellyblog-nest/auth/front';
import { Store } from '@ngrx/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe } from '@angular/common';

function createForm() {
  return new FormGroup({
    userId: new FormControl<string | null>(null),
    newPassword: new FormControl<string | null>(null),
  }, {
    validators: [
      AppValidators.classValidatorToSyncValidator(SetPasswordDto),
    ],
  });
}

@Component({
  templateUrl: './user-set-password.component.html',
  styleUrls: ['./user-set-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ModalContentComponent,
    AsyncPipe,
    ValidationMessageComponent,
  ],
})
export class UserSetPasswordComponent {

  protected readonly form = createForm();

  protected readonly loading = signal(false);

  readonly userId = signal('');

  readonly userName = signal('');

  private readonly authService = inject(AuthService);

  private readonly store = inject(Store);

  protected readonly modal = inject(NgbActiveModal);

  constructor() {
    effect(() => {
      const userIdUnwrapped = this.userId();
      this.form.controls.userId.setValue(userIdUnwrapped);
    });
  }

  async submitForm() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    const {value} = this.form;
    if (!value) {
      return;
    }
    this.loading.set(true);
    try {
      await firstValueFrom(this.authService.setPassword({
        userId: value.userId || '',
        newPassword: value.newPassword || '',
      }));
      this.loading.set(false);
      this.modal.close(true);
    } catch (err: any) {
      this.loading.set(false);
      this.store.dispatch(GlobalActions.addGlobalToast({
        severity: GlobalToastSeverity.ERROR,
        text: err.message,
      }));
    }
  }
}
