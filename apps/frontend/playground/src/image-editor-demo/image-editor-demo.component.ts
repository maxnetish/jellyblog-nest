import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { BorderSize, UiImageEditorComponent } from '@jellyblog-nest/utils/ui-image-editor';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [
    UiImageEditorComponent,
    FormsModule,
  ],
  templateUrl: './image-editor-demo.component.html',
  styleUrl: './image-editor-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageEditorDemoComponent {

  protected readonly chosenImageFile = signal<File>(null);
  private readonly inputFileRef = viewChild<ElementRef<HTMLInputElement>>('inputFileRef');

  protected imageFillStyle = model<string>();
  protected backgroundTransparency = model<number>(0.5);
  protected borderX = model<number>(10);
  protected borderY = model<number>(10);
  protected borderStrokeStyle = model<string>();
  protected disableBoundaryChecks = model(false);
  protected disableCanvasRotation = model(true);
  protected disableHiDPIScaling = model(false);
  protected gridFillStyle = model<string>();
  protected showGrid = model(false);
  protected width = model(450);
  protected height = model(450);
  protected rotate = model(0);
  protected scale = model(1);
  protected borderRadius = model(0);

  protected borderSize = computed(() => {
    return [this.borderX(), this.borderY()] as BorderSize;
  });

  constructor() {
    effect(() => {
      const inputFileRef = this.inputFileRef();

      if (inputFileRef?.nativeElement) {
        inputFileRef.nativeElement.addEventListener('change', (e) => {
          const elm = e.target as HTMLInputElement;
          this.chosenImageFile.set(
            elm.files[0],
          );
        });
      }
    });
  }

  editorEventHandle(e, type = 'UNKNOWN EVENT') {
    console.log(`image-editor ${type}: `, e);
  }
}
