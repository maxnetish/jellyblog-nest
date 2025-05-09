import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  model, OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { BorderSize, Position, UiImageEditorComponent } from '@jellyblog-nest/utils/ui-image-editor';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { fromEvent, map, Subject, takeUntil } from 'rxjs';

@Component({
  imports: [
    UiImageEditorComponent,
    FormsModule,
    JsonPipe,
  ],
  templateUrl: './image-editor-demo.component.html',
  styleUrl: './image-editor-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageEditorDemoComponent implements OnDestroy {

  private unsubscribe$ = new Subject();

  protected readonly chosenImageFileOrUrl = signal<File | string>(null);
  private readonly inputFileRef = viewChild<ElementRef<HTMLInputElement>>('inputFileRef');
  private readonly editorComponentRef = viewChild<UiImageEditorComponent>('editorComponentRef');

  protected imageUrl = model<string>(null);
  protected imageFillStyle = model<string>();
  protected backgroundTransparency = model<number>(0.5);
  protected borderX = model<number>(40);
  protected borderY = model<number>(40);
  protected borderStrokeStyle = model<string>();
  protected disableBoundaryChecks = model(false);
  protected disableCanvasRotation = model(true);
  protected disableHiDPIScaling = model(false);
  protected gridFillStyle = model<string>();
  protected showGrid = model(false);
  protected width = model(200);
  protected height = model(200);
  protected rotate = model(0);
  protected scale = model(1);
  protected borderRadius = model(0);

  protected position = model<Position>();

  protected resultImageUrl = signal<string>(null);

  protected borderSize = computed(() => {
    return [this.borderX(), this.borderY()] as BorderSize;
  });

  private resultImageRef = viewChild<ElementRef<HTMLImageElement>>('resultImageRef');

  protected resultImageDim = signal<{ width: number; height: number; }>(null);

  constructor() {
    effect(() => {
      const inputFileRef = this.inputFileRef();

      if (inputFileRef?.nativeElement) {
        inputFileRef.nativeElement.addEventListener('change', (e) => {
          const elm = e.target as HTMLInputElement;
          this.chosenImageFileOrUrl.set(
            elm.files[0],
          );
        });
      }
    });

    effect(() => {
      const imageUrl = this.imageUrl();
      if (imageUrl) {
        this.chosenImageFileOrUrl.set(imageUrl);
      }
    });

    effect(() => {
      if (this.resultImageRef()?.nativeElement) {
        fromEvent<Event>(this.resultImageRef().nativeElement, 'load').pipe(
          map((evt) => {
            const imgElement = evt.target as HTMLImageElement;
            return {
              width: imgElement.width,
              height: imgElement.height,
            };
          }),
          takeUntil(this.unsubscribe$),
        ).subscribe((dim) => {
          this.resultImageDim.set(dim);
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

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
