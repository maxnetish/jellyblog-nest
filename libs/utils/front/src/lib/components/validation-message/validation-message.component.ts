import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  Optional,
  OnDestroy, forwardRef,
} from '@angular/core';
import { BehaviorSubject, map, merge, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ControlValueAccessor, FormGroupDirective, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-utils-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      multi: true,
      useExisting: forwardRef(() => ValidationMessageComponent),
      provide: NG_VALUE_ACCESSOR,
    },
  ]
})
export class ValidationMessageComponent implements OnDestroy, ControlValueAccessor {

  validationMessages$: Observable<string[]>;

  @Input() set formControlName(val: string | string[]) {
    this.controlName$.next(val);
  }

  private readonly controlName$ = new BehaviorSubject<string | string[] | null>(null);
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    @Optional() private formGroupDirective: FormGroupDirective,
  ) {
    this.validationMessages$ = this.controlName$.pipe(
      takeUntil(this.unsubscribe$),
      switchMap((controlName) => {
        const targetControl = controlName
          && this.formGroupDirective
          && this.formGroupDirective.control.get(controlName);
        if (targetControl) {
          return merge(
            of(targetControl),
            targetControl.statusChanges.pipe(
              map(() => targetControl),
            ),
          );
        } else {
          return of(targetControl);
        }
      }),
      map((control) => {
        if (control && control.errors) {
          return [...Object.values(control.errors)];
        }
        return [];
      }),
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  registerOnChange(fn: any): void {
    // We never change
  }

  registerOnTouched(fn: any): void {
    // We never touch
  }

  writeValue(obj: any): void {
    // We never write any value
  }

}
