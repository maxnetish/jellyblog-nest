import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { SetPasswordDto } from '@jellyblog-nest/auth/model';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { AppValidators, GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';
import { BehaviorSubject, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { AuthService } from '@jellyblog-nest/auth/front';
import { Store } from '@ngrx/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

type UserSetPasswordForm = FormGroup<{
  userId: FormControl<string | null>;
  newPassword: FormControl<string | null>;
}>;

function createForm(): UserSetPasswordForm {
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
})
export class UserSetPasswordComponent implements OnDestroy {

  private userId$ = new BehaviorSubject('');
  private unsubscribe$ = new Subject();

  form = createForm();
  userName$ = new BehaviorSubject('');
  loading$ = new BehaviorSubject(false);

  @Input() set userId(val: string) {
    this.userId$.next(val);
  }

  @Input() set userName(val: string) {
    this.userName$.next(val);
  }

  constructor(
    private readonly authService: AuthService,
    private store: Store,
    readonly modal: NgbActiveModal,
  ) {
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
      await firstValueFrom(this.authService.setPassword({
        userId: value.userId || '',
        newPassword: value.newPassword || '',
      }));
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
