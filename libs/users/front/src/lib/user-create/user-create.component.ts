import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserRole } from '@jellyblog-nest/utils/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@jellyblog-nest/auth/front';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppValidators, GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';
import { CreateUserDto } from '@jellyblog-nest/auth/model';

type CreateUserForm = FormGroup<{
  username: FormControl<string | null>;
  role: FormControl<UserRole | null>;
  password: FormControl<string | null>;
}>;

function createForm(): CreateUserForm {
  return new FormGroup({
    username: new FormControl<string | null>(null),
    role: new FormControl<UserRole>(UserRole.READER),
    password: new FormControl<string | null>(null),
  }, {
    validators: [
      AppValidators.classValidatorToSyncValidator(CreateUserDto),
    ],
  });
}

@Component({
  selector: 'app-users-user-edit',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCreateComponent {

  form = createForm();
  availableRoles: { code: UserRole }[] = [
    {
      code: UserRole.ADMIN,
    },
    {
      code: UserRole.READER,
    },
  ];
  loading$ = new BehaviorSubject(false);

  private async createUser() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return false;
    }
    const { value } = this.form;
    if (!value) {
      return false;
    }
    this.loading$.next(true);
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
      this.loading$.next(false);
      return false;
    }
  }

  constructor(
    readonly modal: NgbActiveModal,
    private readonly authService: AuthService,
    private store: Store,
  ) {
  }

  async submitForm() {
    const success = await this.createUser();
    if (success) {
      this.modal.close(success);
    }
  }

  cancelClick() {
    this.modal.dismiss('cancel');
  }
}
