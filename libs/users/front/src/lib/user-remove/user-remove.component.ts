import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { BaseEntityId } from '@jellyblog-nest/utils/common';
import { FormControl, FormGroup } from '@angular/forms';
import { AppValidators, GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { AuthService } from '@jellyblog-nest/auth/front';
import { Store } from '@ngrx/store';

type UserRemoveForm = FormGroup<{
  uuid: FormControl<string | null>;
}>;

function createForm(): UserRemoveForm {
  return new FormGroup({
    uuid: new FormControl<string | null>(null),
  }, {
    validators: [
      AppValidators.classValidatorToSyncValidator(BaseEntityId),
    ],
  });
}

@Component({
  selector: 'app-users-user-remove',
  templateUrl: './user-remove.component.html',
  styleUrls: ['./user-remove.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRemoveComponent implements OnDestroy {

  private readonly unsubscribe$ = new Subject();

  form = createForm();
  userName$ = new BehaviorSubject('');
  loading$ = new BehaviorSubject(false);
  userId$ = new BehaviorSubject('');

  @Input() set userName(val: string) {
    this.userName$.next(val);
  }

  @Input() set userId(val: string) {
    this.userId$.next(val);
  }

  constructor(
    readonly modal: NgbActiveModal,
    private readonly authService: AuthService,
    private readonly store: Store,
  ) {
    this.userId$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe((userId) => {
      this.form.patchValue({
        uuid: userId,
      });
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
    this.loading$.next(true);
    try {
      await firstValueFrom(this.authService.removeUser({
        uuid: value.uuid || '',
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

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
