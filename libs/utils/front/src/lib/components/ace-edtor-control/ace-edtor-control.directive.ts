import {
  Directive, effect,
  ElementRef,
  forwardRef,
  inject, input, OnDestroy,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { edit as aceEdit } from 'ace-builds';
import { skip, Subject, takeUntil } from 'rxjs';
// load resolver of acer plugins: themes, modes
// builder pull all plugins in app dist directory
// next, esm loads plugins on demand
import 'ace-builds/esm-resolver';

@Directive({
  selector: '[appUtilsAceEditorControl]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AceEditorControlDirective),
      multi: true,
    },
  ],
})
export class AceEditorControlDirective implements ControlValueAccessor, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private aceEditor = aceEdit(this.elementRef.nativeElement);

  private unsubsribe$ = new Subject<void>();
  private changeSubject = new Subject<void>();

  /**
   * Тема для ace editor
   *
   * @default ace/theme/github
   *
   * @see node_modules/ace-builds/webpack-resolver.js
   */
  appUtilsAceEditorTheme = input<string | null>('ace/theme/github');

  /**
   * Режим работы ace editor: Подсветка, авто-дополнения
   *
   * @default ace/mode/markdown
   *
   * @see node_modules/ace-builds/webpack-resolver.js
   */
  appUtilsAceEditorMode = input<string | null>('ace/mode/markdown');

  constructor() {
    this.bindControlValueAccessor();
    this.bindInputSignals();
  }

  writeValue(obj: any): void {
    if (obj == null) {
      this.aceEditor.session.setValue('');
    } else if (typeof obj === 'string') {
      this.aceEditor.session.setValue(obj);
    } else {
      this.aceEditor.session.setValue(String(obj));
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.aceEditor.setReadOnly(isDisabled);
  }

  private handleAceSessionChange = () => {
    this.changeSubject.next();
  }

  private handleAceBlur = (e: Event) => {
    this.onTouched();
  }

  private bindControlValueAccessor() {
    this.aceEditor.session.on('change', () => {
      this.changeSubject.next();
    });

    this.aceEditor.on('blur', () => {
      this.onTouched();
    });

    this.changeSubject.pipe(
      skip(1),
      takeUntil(this.unsubsribe$),
    ).subscribe(() => {
      this.onChange(
        this.aceEditor.session.getValue(),
      );
    });

  }

  private bindInputSignals() {
    effect(() => {
      const theme = this.appUtilsAceEditorTheme();
      this.aceEditor.setTheme(theme || 'ace/theme/github');
    });

    effect(() => {
      const mode = this.appUtilsAceEditorMode();
      this.aceEditor.session.setMode(mode || 'ace/mode/text');
    });
  }

  private onChange = (val: any) => {
  };
  private onTouched = () => {
  };

  ngOnDestroy(): void {
    this.unsubsribe$.next();
    this.unsubsribe$.complete();
  }
}
