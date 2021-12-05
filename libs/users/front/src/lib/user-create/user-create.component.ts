import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { FormBuilder } from '@angular/forms';
import { UserRole } from '@jellyblog-nest/utils/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@jellyblog-nest/auth/front';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppValidators, GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';
import { CreateUserDto } from '@jellyblog-nest/auth/model';

interface CreateUserFormModel {
  username: string;
  role: UserRole;
  password: string;
}

@Component({
  selector: 'app-users-user-edit',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCreateComponent implements OnInit {

  form: IFormGroup<CreateUserFormModel>;
  formBuilder: IFormBuilder;
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
        username: value.username,
        password: value.password,
        role: value.role,
      }));
      return true;
    } catch (err) {
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
    fb: FormBuilder,
  ) {
    this.formBuilder = fb;
    this.form = this.formBuilder.group<CreateUserFormModel>({
      password: [''],
      role: [UserRole.READER],
      username: [''],
    }, {
      validators: [
        AppValidators.classValidatorToSyncValidator(CreateUserDto),
      ],
    });
  }

  ngOnInit(): void {
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
