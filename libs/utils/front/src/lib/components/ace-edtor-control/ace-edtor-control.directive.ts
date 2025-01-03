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
import { debounceTime, map, Subject, takeUntil } from 'rxjs';
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
  private readonly aceEditor = aceEdit(this.elementRef.nativeElement, {
    useWorker: false,
  });

  private readonly unsubsribe$ = new Subject<void>();
  private readonly changeSubject = new Subject<void>();

  private readonly handleAceChange = () => {
    this.changeSubject.next();
  }

  private readonly handleAceBlur = () => {
    this.onTouched();
  }

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
   * @see node_modules/ace-builds/esm-resolver.js
   */
  appUtilsAceEditorMode = input<string | null>('ace/mode/markdown');

  constructor() {

    this.loadAcePlugins().catch((err) => {
      console.warn('Cannot load ace editor plugins. ', err);
    })

    this.bindInputSignals();

    this.aceEditor.session.on('change', this.handleAceChange);
    this.aceEditor.on('blur', this.handleAceBlur);

    this.changeSubject.pipe(
      debounceTime(1000),
      map(() => {
        return this.aceEditor.session.getValue();
      }),
      takeUntil(this.unsubsribe$),
    ).subscribe((editorValue) => {
      this.onChange(editorValue);
    });
  }

  private async loadAcePlugins() {
    await import('ace-builds/src-noconflict/ext-language_tools');
    this.aceEditor.setOption('enableBasicAutocompletion', true);
    this.aceEditor.setOption('enableLiveAutocompletion', true);
  }

  writeValue(obj: any): void {
    // temporaly switch off change hook to prevent emitting
    // of change when value set progrmmatically with writeValue
    this.aceEditor.session.off('change', this.handleAceChange);
    if (obj == null) {
      this.aceEditor.session.setValue('');
    } else if (typeof obj === 'string') {
      this.aceEditor.session.setValue(obj);
    } else {
      this.aceEditor.session.setValue(String(obj));
    }
    this.aceEditor.session.on('change', this.handleAceChange);
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
    this.aceEditor.session.off('change', this.handleAceChange);
    this.aceEditor.off('blur', this.handleAceBlur);
    this.aceEditor.destroy();
  }
}
