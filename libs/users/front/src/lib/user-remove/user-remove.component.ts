import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  signal,
  inject,
  effect,
} from '@angular/core';
import { BaseEntityId } from '@jellyblog-nest/utils/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FormItemComponent,
  GlobalActions,
  GlobalToastSeverity,
  ModalContentComponent,
  ValidationMessageComponent,
} from '@jellyblog-nest/utils/front';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@jellyblog-nest/auth/front';
import { Store } from '@ngrx/store';
import { ClassValidatorFormControl, ClassValidatorFormGroup } from 'ngx-reactive-form-class-validator';

function createForm() {
  return new ClassValidatorFormGroup(
    BaseEntityId,
    {
      uuid: new ClassValidatorFormControl<string | null>(null),
    },
  );
}

@Component({
  selector: 'app-users-user-remove',
  templateUrl: './user-remove.component.html',
  styleUrls: ['./user-remove.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ModalContentComponent,
    ValidationMessageComponent,
    ReactiveFormsModule,
    FormItemComponent,
  ],
})
export class UserRemoveComponent {

  protected readonly form = createForm();

  protected readonly loading = signal(false);

  readonly userName = signal('');

  readonly userId = signal('');

  protected readonly modal = inject(NgbActiveModal);

  private readonly authService = inject(AuthService);

  private readonly store = inject(Store);

  constructor() {
    effect(() => {
      const userIdUnwrapped = this.userId();
      this.form.controls.uuid.setValue(userIdUnwrapped);
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
      await firstValueFrom(this.authService.removeUser({
        uuid: value.uuid || '',
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
