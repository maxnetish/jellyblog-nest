import { Directive, effect, inject, input, OnDestroy, output } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Learn button or any other element to choose files as input[type="file"]
 * by click event.
 */
@Directive({
  selector: '[appUtilsFileChoose]',
  host: {
    '(click)': 'hostClick()',
  },
})
export class FileChooseDirective implements OnDestroy {

  readonly fileChooseDisabled = input(false);

  /**
   * Same as {@link input.accept}
   */
  readonly fileChooseAccept = input<string>();

  /**
   * Whether, a new file should be captured from a user-facing
   * (`user`) or outward facing (`environment`) camera or microphone.
   *
   * @see input.capture
   */
  readonly fileChooseCapture = input<string>();

  /**
   * Same as {@link input.multiple}
   */
  readonly fileChooseMultiple = input(false);

  /**
   * Emits after file chosen
   */
  readonly fileChosen = output<FileList | null>();

  private documentRef = inject(DOCUMENT);

  private readonly inputElement = this.createInputElement();

  constructor() {
    effect(() => {
      this.inputElement.disabled = this.fileChooseDisabled();
    });
    effect(() => {
      this.inputElement.accept = this.fileChooseAccept() || '';
    });
    effect(() => {
      this.inputElement.capture = this.fileChooseCapture() || '';
    });
    effect(() => {
      this.inputElement.multiple = this.fileChooseMultiple();
    });
    this.inputElement.addEventListener('change', this.inputElementChange);
  }

  protected hostClick() {
    this.inputElement.click();
  }

  private inputElementChange = (event: Event) => {
    const inputElm = event.target as HTMLInputElement;
    this.fileChosen.emit(inputElm.files);
  }

  private createInputElement() {
    const result = this.documentRef.createElement('input');
    result.type = 'file';
    return result;
  }

  ngOnDestroy(): void {
    this.inputElement.removeEventListener('change', this.inputElementChange);
    this.inputElement.remove();
  }

}
