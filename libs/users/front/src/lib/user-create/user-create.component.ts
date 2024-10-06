import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserRole } from '@jellyblog-nest/utils/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@jellyblog-nest/auth/front';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  FormItemComponent,
  GlobalActions,
  GlobalToastSeverity,
  ModalContentComponent,
  ValidationMessageComponent,
} from '@jellyblog-nest/utils/front';
import { CreateUserDto } from '@jellyblog-nest/auth/model';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ClassValidatorFormControl, ClassValidatorFormGroup } from 'ngx-reactive-form-class-validator';

function createForm() {
  return new ClassValidatorFormGroup(
    CreateUserDto,
    {
      username: new ClassValidatorFormControl<string | null>(null),
      role: new ClassValidatorFormControl<UserRole>(UserRole.READER),
      password: new ClassValidatorFormControl<string | null>(null),
    },
  );
}

@Component({
  selector: 'app-users-user-edit',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ModalContentComponent,
    ValidationMessageComponent,
    NgSelectComponent,
    FormItemComponent,
  ],
})
export class UserCreateComponent {

  protected readonly form = createForm();

  protected readonly availableRoles: { code: UserRole }[] = [
    {
      code: UserRole.ADMIN,
    },
    {
      code: UserRole.READER,
    },
  ];

  protected readonly loading = signal(false);

  protected readonly modal = inject(NgbActiveModal);

  private readonly authService = inject(AuthService);

  private readonly store = inject(Store);

  private async createUser() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return false;
    }
    const {value} = this.form;
    if (!value) {
      return false;
    }
    this.loading.set(true);
    try {
      await firstValueFrom(this.authService.createUser({
        username: value.username || '',
        password: value.password || '',
        role: value.role || UserRole.READER,
      }));
      return true;
    } catch (err: any) {
      this.store.dispatch(GlobalActions.addGlobalToast({
        severity: GlobalToastSeverity.ERROR,
        text: err.message,
      }));
      this.loading.set(false);
      return false;
    }
  }

  async submitForm() {
    const success = await this.createUser();
    if (success) {
      this.modal.close(success);
    }
  }

}
