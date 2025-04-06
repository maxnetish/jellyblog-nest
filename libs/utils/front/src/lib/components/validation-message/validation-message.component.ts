import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  Optional,
  OnDestroy, forwardRef,
} from '@angular/core';
import {
  BehaviorSubject,
  filter,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  StatusChangeEvent,
  TouchedChangeEvent,
} from '@angular/forms';
import { validationMessageDict } from './validation-message-dict';
import { PushPipe } from '@ngrx/component';

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
    ],
    imports: [
        PushPipe,
    ]
})
export class ValidationMessageComponent implements OnDestroy, ControlValueAccessor {

  validationMessages$: Observable<string[]>;

  @Input() set validationFormControlName(val: string | string[] | undefined) {
    this.controlName$.next(val);
  }

  private readonly controlName$ = new BehaviorSubject<string | string[] | null | undefined>(null);
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    @Optional() private formGroupDirective: FormGroupDirective,
  ) {
    this.validationMessages$ = this.controlName$.pipe(
      switchMap((controlName) => {
        const targetControl = controlName
          && this.formGroupDirective
          && this.formGroupDirective.control.get(controlName);
        if (targetControl) {
          // Будем обновлять сообщения
          // в начале,
          // и на событиях TouchedChangeEvent, StatusChangeEvent
          return merge(
            of(targetControl),
            targetControl.events.pipe(
              filter((ev) => {
                return ev instanceof TouchedChangeEvent || ev instanceof StatusChangeEvent;
              }),
              map(() => {
                return targetControl;
              }),
            ),
          );
        } else {
          return of(targetControl);
        }
      }),
      map((control) => {
        // Показываем сообщения после touched, после первой потери фокуса
        if (control && control.errors && !control.disabled && control.touched) {
          return [...Object.entries(control.errors).map(([key, value]) => {
            if(typeof value === 'string') {
              return value;
            }
            return validationMessageDict.get(key) || key;
          })];
        }
        return [];
      }),
      takeUntil(this.unsubscribe$),
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
