import { ChangeDetectionStrategy, Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { UserRole } from '@jellyblog-nest/utils/common';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { BehaviorSubject, filter, firstValueFrom, map, Observable, Subject, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@jellyblog-nest/auth/front';
import { Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { AppValidators, GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';
import { UpdateUserDto, UserInfoDto } from '@jellyblog-nest/auth/model';

interface RoleChangeFormModel {
  uuid: string;
  role: UserRole;
}

@Component({
  selector: 'app-users-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserUpdateComponent implements OnDestroy {

  private readonly unsubscribe$ = new Subject();

  form: IFormGroup<RoleChangeFormModel>;
  formBuilder: IFormBuilder;
  availableRoles: {code: UserRole}[] = [
    {
      code: UserRole.ADMIN,
    },
    {
    code: UserRole.READER,
    },
  ];
  loading$ = new BehaviorSubject(false);
  userDto$ = new BehaviorSubject<UserInfoDto>({
    role: UserRole.READER,
    username: '',
    uuid: '',
  });
  userName$: Observable<string>;

  @Input() set userDto(val: UserInfoDto) {
    this.userDto$.next(val);
  }

  constructor(
    readonly modal: NgbActiveModal,
    private readonly authService: AuthService,
    private readonly store: Store,
    fb: FormBuilder,
  ) {
    this.formBuilder = fb;
    this.form = this.formBuilder.group<RoleChangeFormModel>({
      role: [UserRole.READER],
      uuid: [''],
    }, {
      validators: [
        AppValidators.classValidatorToSyncValidator(UpdateUserDto),
      ],
    });
    this.userName$ = this.userDto$.pipe(
      map(userDto => userDto.username),
    );
    this.userDto$.pipe(
      takeUntil(this.unsubscribe$),
      filter(userDto => !!userDto),
    ).subscribe((user)=>{
      this.form.patchValue({
        uuid: user.uuid,
        role: user.role,
      });
    })
  }

  cancelClick() {
    this.modal.dismiss('cancel');
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
    const { value } = this.form;
    if (!value) {
      return false;
    }
    this.loading$.next(true);
    try {
      await firstValueFrom(this.authService.updateUser({
        role: value.role,
        uuid: value.uuid,
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

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
