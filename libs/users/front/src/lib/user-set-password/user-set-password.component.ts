import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { SetPasswordDto } from '@jellyblog-nest/auth/model';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { UntypedFormBuilder } from '@angular/forms';
import { AppValidators, GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';
import { BehaviorSubject, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { AuthService } from '@jellyblog-nest/auth/front';
import { Store } from '@ngrx/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

type UserSetPasswordFormModel = SetPasswordDto;

@Component({
  templateUrl: './user-set-password.component.html',
  styleUrls: ['./user-set-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSetPasswordComponent implements OnDestroy {

  private formBuilder: IFormBuilder;
  private userId$ = new BehaviorSubject('');
  private unsubscribe$ = new Subject();

  form: IFormGroup<UserSetPasswordFormModel>;
  userName$ = new BehaviorSubject('');
  loading$ = new BehaviorSubject(false);

  @Input() set userId(val: string) {
    this.userId$.next(val);
  }

  @Input() set userName(val: string) {
    this.userName$.next(val);
  }

  constructor(
    fb: UntypedFormBuilder,
    private readonly authService: AuthService,
    private store: Store,
    readonly modal: NgbActiveModal,
  ) {
    this.formBuilder = fb;

    this.form = this.formBuilder.group<UserSetPasswordFormModel>({
      userId: [''],
      newPassword: [''],
    }, {
      validators: [
        AppValidators.classValidatorToSyncValidator(SetPasswordDto),
      ],
    });

    this.userId$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(
      (userId) => {
        this.form.patchValue({
          userId,
        });
      },
    );

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
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
    this.loading$.next(true);
    try {
      await firstValueFrom(this.authService.setPassword(value));
      this.loading$.next(false);
      this.modal.close(true);
    } catch (err: any) {
      this.loading$.next(false);
      this.store.dispatch(GlobalActions.addGlobalToast({
        severity: GlobalToastSeverity.ERROR,
        text: err.message,
      }));
    }
  }

  cancelClick() {
    this.modal.dismiss('cancel');
  }
}
