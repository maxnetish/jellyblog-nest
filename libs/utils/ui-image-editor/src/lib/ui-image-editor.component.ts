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
import {
  Subject,
  takeUntil,
} from 'rxjs';
import { paintBackground } from './utils/paint-background';
import { ImageState } from './utils/image-state';
import { paintImage } from './utils/paint-image';
import { observeDrag } from './utils/observe-drag';
import { BorderSize } from './utils/border-size';
import { Position } from './utils/position';

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

  /**
   * Width of cropping area in editor
   */
  readonly width = input<number>(200);

  /**
   * Height of cropping area in editor
   */
  readonly height = input<number>(200);

  /**
   * Custom styles for internal canvas element.
   * @see {@link ngStyle}
   */
  readonly canvasStyle = input<Record<string, any>>();

  /**
   * Input image to edit as URL or File
   */
  readonly image = input<string | File>();

  /**
   * Size of cropping borders. Image will be visible through the border, but cut
   * off in the resulting image. Treated as horizontal and vertical borders when
   * passed an array.
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

  /**
   * The x and y co-ordinates (in the range 0 to 1) of the center
   * of the cropping area of the image. Also, you can use two-way binding to
   * reflect manipulation in component.
   */
  readonly position = input<Position>();

  /**
   * The scale of the image. You can use this to add your own resizing slider.
   */
  readonly scale = input<number>(1);

  /**
   * Degrees clockwise
   */
  readonly rotate = input<number>(0);

  /**
   * The cropping area border radius.
   */
  readonly borderRadius = input<number>(0);

  /**
   * The value to use for the crossOrigin property of the image,
   * if loaded from a non-data URL. Valid values are `"anonymous"`
   * and `"use-credentials"`. See
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes this page}
   * for more information.
   */
  readonly crossOrigin = input<'' | 'anonymous' | 'use-credentials'>();

  /**
   * Invoked when an image load fails.
   */
  readonly loadFailure = output<unknown>();

  /**
   * Invoked when an image (whether passed by props or dropped) load succeeds.
   */
  readonly loadSuccess = output<ImageState>();

  /**
   * Invoked when the image is painted on the canvas.
   */
  readonly imageReady = output<void>();

  /**
   * Invoked when the user pans the editor to change the selected
   * area of the image. Passed a position object in the form
   * `{ x: 0.5, y: 0.5 }` where x and y are the relative `x` and `y`
   * coordinates of the center of the selected area.
   */
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

  /**
   * Set to true to allow the image to be moved outside the cropping boundary.
   */
  readonly disableBoundaryChecks = input<boolean>(false);

  /**
   * Set to true to disable devicePixelRatio based canvas scaling. Can
   * improve performance of very large canvases on mobile devices.
   */
  readonly disableHiDPIScaling = input<boolean>(false);

  /**
   * Switch off auto orientation of canvas (?)
   */
  readonly disableCanvasRotation = input<boolean>(true);

  /**
   * The style of the 1px border around the mask.
   * If not provided, no border will be drawn.
   * @see {@link CanvasRenderingContext2D.strokeStyle}
   */
  readonly borderStrokeStyle = input<CanvasFillStrokeStyles['strokeStyle']>();

  /**
   * Whether draws a "Rule of Three" grid on the canvas.
   */
  readonly showGrid = input<boolean>(false);

  /**
   * Style of "Rule of Three" grid
   */
  readonly gridFillStyle = input<CanvasFillStrokeStyles['fillStyle']>('#666');

  /**
   * true while dragging
   */
  private readonly dragState = signal(false);

  /**
   * Current state of image.
   * Relative position of center, width, height and image source as image element.
   */
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
        const calculatedPosition = this.calculatedPositionWithBorders();
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

    // track dragging
    effect(() => {
      const canvasElement = this.canvasElement();

      if (canvasElement && this.documentRef) {
        const {dragState$, movement$} = observeDrag({
          dragSourceElement: canvasElement,
          documentRef: this.documentRef,
          throttleTimeDuration: 100,
        });

        // separately track position changes when dragging
        movement$.pipe(
            takeUntil(this.unsubscribe$),
          ).subscribe((movement) => {
            this.handleDragMove(movement);
          });

        // and start/stop of dragging
        dragState$.pipe(
          takeUntil(this.unsubscribe$),
        ).subscribe((state) => {
          // We can make this.dragState observale
          this.dragState.set(state);
        });
      }
    });

    // emit position change event
    effect(() => {
      const stateImage = this.stateImage();
      this.positionChange.emit({
        x: stateImage.x,
        y: stateImage.y,
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Device pixel ratio
   */
  protected readonly pixelRatio = computed(() => {
    if (this.disableHiDPIScaling()) {
      return 1;
    }
    return this.windowRef?.devicePixelRatio || 1;
  });

  /**
   * Vertical orientation of canvas
   */
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
      cursor: this.dragState() ? 'grabbing' : 'grab',
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

  private readonly calculatedPositionWithBorders = computed(() => {
    const calculatedPositionWithoutBorders = this.calculatedPositionWithoutBorders();
    const [borderX, borderY] = this.borderSizeNormalized();
    const isVertical = this.isVertical();

    return {
      ...calculatedPositionWithoutBorders,
      x: calculatedPositionWithoutBorders.x + (isVertical ? borderY : borderX),
      y: calculatedPositionWithoutBorders.y + (isVertical ? borderX : borderY),
    };
  });

  private readonly calculatedPositionWithoutBorders = computed(() => {
    const image = this.stateImage();

    const croppingRect = this.croppingRect();

    const width = (image?.width || 0) * this.scale();
    const height = (image?.height || 0) * this.scale();

    const x = -croppingRect.x * width;
    const y = -croppingRect.y * height;

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

    this.dragState.set(false);
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

      this.stateImage.update((currentValue) => {
        return {
          ...currentValue,
          ...position,
        };
      });
    }
  }

  fetchResult() {
    // get relative coordinates (0 to 1)
    const cropRect = {
      ...this.croppingRect(),
    };
    const image = this.stateImage();

    if (!image.resource) {
      throw new Error('Missing image resource.')
    }

    // transform ratios to actual pixel coordinates
    cropRect.x *= image.resource.width;
    cropRect.y *= image.resource.height;
    cropRect.width *= image.resource.width;
    cropRect.height *= image.resource.height;

    // create a canvas with the correct dimensions
    const canvas = this.documentRef.createElement('canvas');

    if (this.isVertical()) {
      canvas.width = cropRect.height;
      canvas.height = cropRect.width;
    } else {
      canvas.width = cropRect.width;
      canvas.height = cropRect.height;
    }

    // draw the full-size image at the correct position,
    // the image gets truncated to the size of the canvas.
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Missing 2d context.');
    }

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((this.rotate() * Math.PI) / 180);
    context.translate(-(canvas.width / 2), -(canvas.height / 2));

    if (this.isVertical()) {
      context.translate(
        (canvas.width - canvas.height) / 2,
        (canvas.height - canvas.width) / 2,
      )
    }

    const imageFillStyle = this.imageFillStyle();
    if (imageFillStyle) {
      context.fillStyle = imageFillStyle;
      context.fillRect(0, 0, canvas.width, canvas.height)
    }

    context.drawImage(image.resource, -cropRect.x, -cropRect.y);

    return canvas;
  }

  fetchResultScaled() {
    const width = this.width();
    const height = this.height();
    // const { width, height } = this.getDimensions()

    const canvas = this.documentRef.createElement('canvas');

    if (this.isVertical()) {
      canvas.width = height;
      canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    const context = canvas.getContext('2d');

    if(!context) {
      throw new Error('missing 2d context');
    }

    // don't paint a border here, as it is the resulting image
    paintImage({
      context,
      image: this.stateImage(),
      imageFillStyle: this.imageFillStyle(),
      rotate: this.rotate(),
      scaleFactor: 1,
      calculatedPosition: this.calculatedPositionWithoutBorders(),
      isVertical: this.isVertical(),
    });

    return canvas;
  }

}
