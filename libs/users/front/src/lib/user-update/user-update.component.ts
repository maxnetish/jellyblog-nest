import {
  ChangeDetectionStrategy,
  Component,
  computed, effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { UserRole } from '@jellyblog-nest/utils/common';
import { firstValueFrom } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@jellyblog-nest/auth/front';
import { Store } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FormItemComponent,
  GlobalActions,
  GlobalToastSeverity,
  ModalContentComponent,
  ValidationMessageComponent,
} from '@jellyblog-nest/utils/front';
import { UpdateUserDto, UserInfoDto } from '@jellyblog-nest/auth/model';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ClassValidatorFormControl, ClassValidatorFormGroup } from 'ngx-reactive-form-class-validator';

function createForm() {
  return new ClassValidatorFormGroup(
    UpdateUserDto,
    {
      uuid: new ClassValidatorFormControl<string | null>(null),
      role: new ClassValidatorFormControl<UserRole>(UserRole.READER),
    },
  );
}

@Component({
  selector: 'app-users-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ModalContentComponent,
    NgSelectComponent,
    ValidationMessageComponent,
    FormItemComponent,
  ],
})
export class UserUpdateComponent {

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

  readonly userDto = signal<UserInfoDto>({
    role: UserRole.READER,
    username: '',
    uuid: '',
  });

  protected readonly userName = computed(() => {
    const userDtoUnwrapped = this.userDto();
    return userDtoUnwrapped?.username;
  });

  constructor() {
    effect(() => {
      const userDtoUnwrapped = this.userDto();
      this.form.setValue({
        uuid: userDtoUnwrapped.uuid,
        role: userDtoUnwrapped.role,
      });
    });
  }

  async submitForm() {
    const success = await this.updateRole();
    if (success) {
      this.modal.close(success);
    }
  }

  private async updateRole() {
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
      await firstValueFrom(this.authService.updateUser({
        role: value.role || UserRole.READER,
        uuid: value.uuid || '',
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

}
