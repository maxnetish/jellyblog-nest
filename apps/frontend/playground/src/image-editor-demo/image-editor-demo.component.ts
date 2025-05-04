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
import { BorderSize, Position, UiImageEditorComponent } from '@jellyblog-nest/utils/ui-image-editor';
import { FormsModule } from '@angular/forms';
import { JsonPipe, NgOptimizedImage } from '@angular/common';

@Component({
  imports: [
    UiImageEditorComponent,
    FormsModule,
    NgOptimizedImage,
    JsonPipe,
  ],
  templateUrl: './image-editor-demo.component.html',
  styleUrl: './image-editor-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageEditorDemoComponent {

  protected readonly chosenImageFile = signal<File>(null);
  private readonly inputFileRef = viewChild<ElementRef<HTMLInputElement>>('inputFileRef');
  private readonly editorComponentRef = viewChild<UiImageEditorComponent>('editorComponentRef');

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

  protected position = model<Position>();

  protected resultImageUrl = signal<string>(null);

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

  fetchResultButtonClick() {
    const editorComponentRef = this.editorComponentRef();
    const dataUrl = editorComponentRef.fetchResult().toDataURL();
    this.resultImageUrl.set(dataUrl);
  }

  fetchResultScaledButtonClick() {
    const editorComponentRef = this.editorComponentRef();
    const dataUrl = editorComponentRef.fetchResultScaled().toDataURL();
    this.resultImageUrl.set(dataUrl);
  }

  editorEventHandle(e, type = 'UNKNOWN EVENT') {
    console.log(`image-editor ${type}: `, e);
  }
}
