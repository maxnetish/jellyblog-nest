import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { isFileAPISupported } from './utils/is-file-api-supported';
import { loadImageFile } from './utils/load-image-file';
import { loadImageURL } from './utils/load-image-url';
import { drawRoundedRect } from './utils/draw-rounded-rect';
import { drawGrid } from './utils/draw-grid';
import { isTouchDevice } from './utils/is-touch-device';
import {
  defer, filter,
  fromEvent,
  map,
  merge,
  pairwise,
  race,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs';
import { paintBackground } from './utils/paint-background';
import { ImageState } from './utils/image-state';
import { paintImage } from './utils/paint-image';
import { observeDragPosition } from './utils/observe-drag-poistion';

export type BorderSize = [number, number] | number;

export interface Position {
  x: number;
  y: number;
}

@Component({
  selector: 'mg-ui-image-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-image-editor.component.html',
  styleUrl: './ui-image-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiImageEditorComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();

  private readonly defaultEmptyImage: ImageState = {
    x: 0.5,
    y: 0.5,
  };

  private canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvasRef');

  private readonly documentRef = inject(DOCUMENT);

  private get windowRef() {
    return this.documentRef?.defaultView;
  }

  // input and output "props" with defaults
  readonly width = input<number>(200);
  readonly height = input<number>(200);
  /**
   * Custom styles for canvas element.
   * @see {@link ngStyle}
   */
  readonly canvasStyle = input<Record<string, any>>();
  readonly image = input<string | File>();

  /**
   * Size of borders.
   *
   * @example
   * // hor border: 10, vert border 20
   * [10, 20]
   * // all borders 10
   * 10
   *
   * @default 25
   */
  readonly borderSize = input<BorderSize>(25);
  readonly position = input<Position>();
  readonly scale = input<number>(1);

  /**
   * Degrees clockwise
   */
  readonly rotate = input<number>(0);
  readonly borderRadius = input<number>(0);
  readonly crossOrigin = input<'' | 'anonymous' | 'use-credentials'>();
  readonly loadFailure = output<unknown>();
  readonly loadSuccess = output<ImageState>();
  readonly imageReady = output<void>();
  readonly imageChange = output<void>();
  readonly mouseUp = output<void>();
  readonly mouseMove = output<TouchEvent | MouseEvent>();
  readonly positionChange = output<Position>();

  /**
   * Transparency of background elements
   *
   * @default 0.5
   */
  readonly backgroundTransparency = input<number>(0.5);

  /**
   * The default style is #000 (black).
   * @see {@link  CanvasRenderingContext2D.fillStyle}
   */
  readonly imageFillStyle = input<CanvasFillStrokeStyles['fillStyle']>();

  readonly disableBoundaryChecks = input<boolean>(false);
  readonly disableHiDPIScaling = input<boolean>(false);
  readonly disableCanvasRotation = input<boolean>(true);

  /**
   * Border around.
   * @default null
   * @see {@link CanvasRenderingContext2D.strokeStyle}
   */
  readonly borderStrokeStyle = input<CanvasFillStrokeStyles['strokeStyle']>();
  readonly showGrid = input<boolean>(false);
  readonly gridFillStyle = input<CanvasFillStrokeStyles['fillStyle']>('#666');

  // internal "state"
  // TODO можно выпилить по идее
  private readonly stateDrag = signal(false);
  private readonly stateImage = signal(this.defaultEmptyImage);

  constructor() {
    // load image
    effect(() => {
      const image = this.image();

      if (image) {
        this.loadImage(image);
      } else {
        this.clearImage();
      }
    });

    // repaint canvas
    effect(() => {
      const canvasElement = this.canvasElement();
      const context = this.canvasContext2D();
      if (canvasElement && context) {
        const pixelRatio = this.pixelRatio();
        const backgroundTransparency = this.backgroundTransparency();
        const gridFillStyle = this.gridFillStyle();
        const showGrid = this.showGrid();
        const borderStrokeStyle = this.borderStrokeStyle();
        const borderSize = this.borderSizeNormalized();
        const dimensionCanvasHeight = this.dimensionCanvasHeight();
        const dimensionCanvasWidth = this.dimensionCanvasWidth();
        const borderRadius = this.borderRadius();
        const image = this.stateImage();
        const isVertical = this.isVertical();
        const calculatedPosition = this.calculatedPosition();
        const scaleFactor = this.pixelRatio();
        const rotate = this.rotate();
        const imageFillStyle = this.imageFillStyle();

        //  skip to allow canvas element change size before paint
        setTimeout(() => {
          context.clearRect(0, 0, canvasElement.width, canvasElement.height);
          paintBackground({
            context,
            pixelRatio,
            backgroundTransparency,
            gridFillStyle,
            showGrid,
            borderStrokeStyle,
            borderSize,
            dimensionCanvasHeight,
            dimensionCanvasWidth,
            borderRadius,
          });
          paintImage({
            context,
            image,
            isVertical,
            calculatedPosition,
            scaleFactor,
            rotate,
            imageFillStyle,
          });
        }, 0);

      }
    });

    effect(() => {
      // from react-avatar-editor
      // когда дергать onImageChange - наверно не надо или как то по другому придумать
      // if (
      //   prevProps.image !== this.props.image ||
      //   prevProps.width !== this.props.width ||
      //   prevProps.height !== this.props.height ||
      //   prevProps.position !== this.props.position ||
      //   prevProps.scale !== this.props.scale ||
      //   prevProps.rotate !== this.props.rotate ||
      //   prevState.my !== this.state.my ||
      //   prevState.mx !== this.state.mx ||
      //   prevState.image.x !== this.state.image.x ||
      //   prevState.image.y !== this.state.image.y
      // ) {
      //   this.props.onImageChange?.()
      // }
    });

    effect(() => {
      const canvasElement = this.canvasElement();

      if (canvasElement && this.documentRef) {
        observeDragPosition({
          dragSourceElement: canvasElement,
          documentRef: this.documentRef,
          throttleTimeDuration: 100,
        }).pipe(
          takeUntil(this.unsubscribe$),
        ).subscribe((movement) => {
          this.handleDragMove(movement);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected readonly pixelRatio = computed(() => {
    if (this.disableHiDPIScaling()) {
      return 1;
    }
    return this.windowRef?.devicePixelRatio || 1;
  });

  private readonly isVertical = computed(() => {
    return !this.disableCanvasRotation() && this.rotate() % 180 !== 0;
  });

  private readonly borderSizeNormalized = computed((): [number, number] => {
    const border = this.borderSize();
    return Array.isArray(border) ? border : [border, border];
  });

  protected dimensionCanvasWidth = computed(() => {
    const width = this.width();
    const height = this.height();
    const isVertical = this.isVertical();
    const [borderX] = this.borderSizeNormalized();

    const resultWithoutBorder = isVertical ? height : width;
    return resultWithoutBorder + borderX * 2;
  });

  protected dimensionCanvasHeight = computed(() => {
    const width = this.width();
    const height = this.height();
    const isVertical = this.isVertical();
    const [, borderY] = this.borderSizeNormalized();

    const resultWithoutBorder = isVertical ? width : height;
    return resultWithoutBorder + borderY * 2;
  });

  private readonly defaultStyle = computed(() => {
    return {
      ['width.px']: this.dimensionCanvasWidth(),
      ['height.px']: this.dimensionCanvasHeight(),
      cursor: this.stateDrag() ? 'grabbing' : 'grab',
      touchAction: 'none',
    };
  });

  protected readonly computedStyle = computed(() => {
    return {
      ...this.defaultStyle(),
      ...this.canvasStyle(),
    };
  });

  private canvasElement = computed(() => {
    const canvasRef = this.canvasRef();
    return canvasRef?.nativeElement;
  });

  private canvasContext2D = computed(() => {
    const canvasElement = this.canvasElement();
    return canvasElement?.getContext('2d');
  });

  private readonly calculatedPosition = computed(() => {
    const image = this.stateImage();
    const [borderX, borderY] = this.borderSizeNormalized();

    // if (!image?.width || !image?.height) {
    //   throw new Error('Image dimension is unknown.');
    // }

    const croppingRect = this.croppingRect();

    const width = (image?.width || 0) * this.scale();
    const height = (image?.height || 0) * this.scale();

    let x = -croppingRect.x * width;
    let y = -croppingRect.y * height;

    if (this.isVertical()) {
      x += borderY;
      y += borderX;
    } else {
      x += borderX;
      y += borderY;
    }

    return {x, y, height, width};
  });

  private readonly croppingRect = computed(() => {
    const position = this.position() || {
      x: this.stateImage().x,
      y: this.stateImage().y,
    };
    const width = (1 / this.scale()) * this.xScale();
    const height = (1 / this.scale()) * this.yScale();

    const croppingRect = {
      x: position.x - width / 2,
      y: position.y - height / 2,
      width,
      height,
    };

    let xMin = 0;
    let xMax = 1 - croppingRect.width;
    let yMin = 0;
    let yMax = 1 - croppingRect.height;

    // If the cropping rect is larger than the image, then we need to change
    // our maxima & minima for x & y to allow the image to appear anywhere up
    // to the very edge of the cropping rect.
    const isLargerThanImage =
      this.disableBoundaryChecks() || width > 1 || height > 1;

    if (isLargerThanImage) {
      xMin = -croppingRect.width;
      xMax = 1;
      yMin = -croppingRect.height;
      yMax = 1;
    }

    const result = {
      ...croppingRect,
      x: Math.max(xMin, Math.min(croppingRect.x, xMax)),
      y: Math.max(yMin, Math.min(croppingRect.y, yMax)),
    };

    return result;
  });

  private readonly xScale = computed(() => {
    const stateImage = this.stateImage();

    const canvasAspect = this.width() / this.height();
    const imageAspect = (stateImage?.width || 0) / (stateImage?.height || 0);

    return Math.min(1, canvasAspect / imageAspect);
  });

  private readonly yScale = computed(() => {
    const stateImage = this.stateImage();

    const canvasAspect = this.height() / this.width();
    const imageAspect = (stateImage?.height || 0) / (stateImage?.width || 0);

    return Math.min(1, canvasAspect / imageAspect);
  });

  private handleImageReady(image: HTMLImageElement) {
    const imageState: ImageState = {
      ...this.getInitialSize(image.width, image.height),
      resource: image,
      x: 0.5,
      y: 0.5,
    };

    this.stateDrag.set(false);
    this.stateImage.set(imageState);

    this.imageReady.emit();
    this.loadSuccess.emit(imageState);
  }

  private getInitialSize(width: number, height: number) {
    let newHeight: number;
    let newWidth: number;

    // const dimensions = this.getDimensions()
    const canvasRatio = this.height() / this.width();
    const imageRatio = height / width;

    if (canvasRatio > imageRatio) {
      newHeight = this.height();
      newWidth = width * (newHeight / height);
    } else {
      newWidth = this.width();
      newHeight = height * (newWidth / width);
    }

    return {
      height: newHeight,
      width: newWidth,
    };
  }

  private async loadImage(file: File | string) {
    if (isFileAPISupported && file instanceof File) {
      try {
        const image = await loadImageFile(file);
        this.handleImageReady(image);
      } catch (error) {
        this.loadFailure.emit(error);
      }
    } else if (typeof file === 'string') {
      try {
        const image = await loadImageURL(file, this.crossOrigin());
        this.handleImageReady(image);
      } catch (error) {
        this.loadFailure.emit(error);
      }
    }
  }

  private clearImage() {
    const canvasElement = this.canvasElement();
    const context = this.canvasContext2D();

    if (canvasElement && context) {
      context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
    this.stateImage.set(this.defaultEmptyImage);
  }

  private handleDragMove(movement: {mx: number; my: number}) {

    let rotate = this.rotate();
    rotate %= 360;
    rotate = rotate < 0 ? rotate + 360 : rotate;

    const stateImage = this.stateImage();
    if (stateImage?.width && stateImage?.height) {
      const mx = movement.mx;
      const my = movement.my;

      const width = stateImage.width * this.scale();
      const height = stateImage.height * this.scale();

      let {x: lastX, y: lastY} = this.croppingRect();

      lastX *= width;
      lastY *= height;

      // helpers to calculate vectors
      const toRadians = (degree: number) => degree * (Math.PI / 180);
      const cos = Math.cos(toRadians(rotate));
      const sin = Math.sin(toRadians(rotate));

      const x = lastX + mx * cos + my * sin;
      const y = lastY + -mx * sin + my * cos;

      const relativeWidth = (1 / this.scale()) * this.xScale();
      const relativeHeight = (1 / this.scale()) * this.yScale();

      const position = {
        x: x / width + relativeWidth / 2,
        y: y / height + relativeHeight / 2,
      };

      this.positionChange.emit(position);

      this.stateImage.update((currentValue) => {
        return {
          ...currentValue,
          ...position,
        };
      });
    }
  }

}
