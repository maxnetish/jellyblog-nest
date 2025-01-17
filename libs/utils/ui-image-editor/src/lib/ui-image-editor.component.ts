import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { isFileAPISupported } from './utils/is-file-api-supported';
import { loadImageFile } from './utils/load-image-file';
import { loadImageURL } from './utils/load-image-url';
import { drawRoundedRect } from './utils/draw-rounded-rect';
import { drawGrid } from './utils/draw-grid';
import { isPassiveSupported } from './utils/is-passive-supported';
import { isTouchDevice } from './utils/is-touch-device';

export type BorderType = [number, number] | number;

interface ImageState {
  x: number;
  y: number;
  width?: number;
  height?: number;
  resource?: HTMLImageElement;
}

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
export class UiImageEditorComponent implements OnInit, OnDestroy {
  private readonly defaultEmptyImage: ImageState = {
    x: 0.5,
    y: 0.5,
  };

  @ViewChild('canvasRef', { static: true })
  private canvasRef: ElementRef<HTMLCanvasElement> | null = null;

  /**
   * OnInit done, viewchild must be ready
   */
  private componentInitDone = signal(false);

  private readonly documentRef = inject(DOCUMENT);
  private get windowRef() {
    return this.documentRef?.defaultView;
  }

  // input and output "props" with defaults
  readonly width = input<number>(200);
  readonly height = input<number>(200);
  // We should use ng style descriptions instead of react CSSProperties
  readonly canvasStyle = input<Record<string, any>>();
  readonly image = input<string | File>();
  readonly border = input<BorderType>(25);
  readonly position = input<Position>();
  readonly scale = input<number>(1);
  readonly rotate = input<number>(0);
  readonly borderRadius = input<number>(0);
  readonly crossOrigin = input<'' | 'anonymous' | 'use-credentials'>();
  readonly onLoadFailure = output<unknown>();
  readonly onLoadSuccess = output<ImageState>();
  readonly onImageReady = output<void>();
  readonly onImageChange = output<void>();
  readonly onMouseUp = output<void>();
  readonly onMouseMove = output<TouchEvent | MouseEvent>();
  readonly onPositionChange = output<Position>();
  readonly color = input<[number, number, number, number?]>([0, 0, 0, 0.5]);
  readonly backgroundColor = input<string>();
  readonly disableBoundaryChecks = input<boolean>(false);
  readonly disableHiDPIScaling = input<boolean>(false);
  readonly disableCanvasRotation = input<boolean>(true);
  readonly borderColor = input<[number, number, number, number?]>();
  readonly showGrid = input<boolean>(false);
  readonly gridColor = input<string>('#666');

  // internal "state"
  private readonly stateDrag = signal(false);
  private readonly stateMy = signal<number | undefined>(undefined);
  private readonly stateMx = signal<number | undefined>(undefined);
  private readonly stateImage = signal(this.defaultEmptyImage);

  constructor() {
    // load image
    effect(() => {
      // after OnInit
      // to use viewchildren
      if (!this.componentInitDone()) {
        return;
      }

      const image = this.image();

      if (image) {
        this.loadImage(image);
      } else {
        this.clearImage();
      }
    });

    // repaint canvas
    effect(() => {
      // after OnInit
      // to use viewchildren
      if (!this.componentInitDone()) {
        return;
      }

      const context = this.getContext();
      context.clearRect(0, 0, this.getCanvas().width, this.getCanvas().height);
      this.paint(context);
      this.paintImage(context, this.stateImage());
    });

    effect(() => {
      // after OnInit
      // to use viewchildren
      if (!this.componentInitDone()) {
        return;
      }

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

    const optionsHandlerPassive = isPassiveSupported(this.windowRef)
      ? { passive: false }
      : false;

    if (this.documentRef) {
      this.documentRef.addEventListener(
        'mousemove',
        this.handleMouseMove,
        optionsHandlerPassive
      );
      this.documentRef.addEventListener(
        'mouseup',
        this.handleMouseUp,
        optionsHandlerPassive
      );

      if (isTouchDevice(this.windowRef)) {
        this.documentRef.addEventListener(
          'touchmove',
          this.handleMouseMove,
          optionsHandlerPassive
        );
        this.documentRef.addEventListener(
          'touchend',
          this.handleMouseUp,
          optionsHandlerPassive
        );
      }
    }
  }

  ngOnInit(): void {
    this.componentInitDone.set(true);
  }

  ngOnDestroy(): void {
    if (this.documentRef) {
      this.documentRef.removeEventListener(
        'mousemove',
        this.handleMouseMove,
        false
      );
      this.documentRef.removeEventListener(
        'mouseup',
        this.handleMouseUp,
        false
      );

      if (isTouchDevice(this.windowRef)) {
        this.documentRef.removeEventListener(
          'touchmove',
          this.handleMouseMove,
          false
        );
        this.documentRef.removeEventListener(
          'touchend',
          this.handleMouseUp,
          false
        );
      }
    }
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

  private readonly bordersNormalized = computed((): [number, number] => {
    const border = this.border();
    return Array.isArray(border) ? border : [border, border];
  });

  protected dimensionCanvasWidth = computed(() => {
    const width = this.width();
    const height = this.height();
    const isVertical = this.isVertical();
    const [borderX] = this.bordersNormalized();

    const resultWithoutBorder = isVertical ? height : width;
    return resultWithoutBorder + borderX * 2;
  });

  protected dimensionCanvasHeight = computed(() => {
    const width = this.width();
    const height = this.height();
    const isVertical = this.isVertical();
    const [, borderY] = this.bordersNormalized();

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

  private getCanvas(): HTMLCanvasElement {
    if (!this.canvasRef) {
      throw new Error('No canvas found');
    }

    return this.canvasRef.nativeElement;
  }

  private getContext() {
    const context = this.getCanvas()?.getContext('2d');
    if (!context) {
      throw new Error('No context found');
    }
    return context;
  }

  protected handleMouseDown(e: MouseEvent) {
    // if e is a touch event, preventDefault keeps
    // corresponding mouse events from also being fired
    // later.
    e.preventDefault();
    this.stateDrag.set(true);
    this.stateMx.set(undefined);
    this.stateMy.set(undefined);
  }

  protected handleTouchStart() {
    // if e is a touch event, preventDefault keeps
    // corresponding mouse events from also being fired
    // later.
    this.stateDrag.set(true);
    this.stateMx.set(undefined);
    this.stateMy.set(undefined);
  }

  private handleImageReady(image: HTMLImageElement) {
    const imageState: ImageState = {
      ...this.getInitialSize(image.width, image.height),
      resource: image,
      x: 0.5,
      y: 0.5,
    };

    this.stateDrag.set(false);
    this.stateImage.set(imageState);

    this.onImageReady.emit();
    this.onLoadSuccess.emit(imageState);
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
        this.onLoadFailure.emit(error);
      }
    } else if (typeof file === 'string') {
      try {
        const image = await loadImageURL(file, this.crossOrigin());
        this.handleImageReady(image);
      } catch (error) {
        this.onLoadFailure.emit(error);
      }
    }
  }

  private paint(context: CanvasRenderingContext2D) {
    context.save();
    context.scale(this.pixelRatio(), this.pixelRatio());
    context.translate(0, 0);
    context.fillStyle = `rgba(${this.color().slice(0, 4).join(',')})`;

    let borderRadius = this.borderRadius();
    // const dimensions = this.getDimensions();
    const [borderSizeX, borderSizeY] = this.bordersNormalized();
    const height = this.dimensionCanvasHeight();
    const width = this.dimensionCanvasWidth();

    // clamp border radius between zero (perfect rectangle) and half the size without borders (perfect circle or "pill")
    borderRadius = Math.max(borderRadius, 0);
    borderRadius = Math.min(
      borderRadius,
      width / 2 - borderSizeX,
      height / 2 - borderSizeY
    );

    context.beginPath();
    // inner rect, possibly rounded
    drawRoundedRect(
      context,
      borderSizeX,
      borderSizeY,
      width - borderSizeX * 2,
      height - borderSizeY * 2,
      borderRadius
    );
    context.rect(width, 0, -width, height); // outer rect, drawn "counterclockwise"
    context.fill('evenodd');

    // Draw 1px border around the mask only if borderColor is provided
    const borderColor = this.borderColor();
    if (borderColor) {
      context.strokeStyle = `rgba(${borderColor.slice(0, 4).join(',')})`;
      context.lineWidth = 1;
      context.beginPath();
      drawRoundedRect(
        context,
        borderSizeX + 0.5,
        borderSizeY + 0.5,
        width - borderSizeX * 2 - 1,
        height - borderSizeY * 2 - 1,
        borderRadius
      );
      context.stroke();
    }

    if (this.showGrid()) {
      drawGrid(
        context,
        borderSizeX,
        borderSizeY,
        width - borderSizeX * 2,
        height - borderSizeY * 2,
        this.gridColor()
      );
    }
    context.restore();
  }

  private clearImage() {
    const canvas = this.getCanvas();
    const context = this.getContext();

    context.clearRect(0, 0, canvas.width, canvas.height);
    this.stateImage.set(this.defaultEmptyImage);
  }

  private paintImage(
    context: CanvasRenderingContext2D,
    image: ImageState,
    scaleFactor = this.pixelRatio()
  ) {
    if (!image.resource) return;

    const position = this.calculatePosition(image);

    context.save();

    context.translate(context.canvas.width / 2, context.canvas.height / 2);
    context.rotate((this.rotate() * Math.PI) / 180);
    context.translate(
      -(context.canvas.width / 2),
      -(context.canvas.height / 2)
    );

    if (this.isVertical()) {
      context.translate(
        (context.canvas.width - context.canvas.height) / 2,
        (context.canvas.height - context.canvas.width) / 2
      );
    }

    context.scale(scaleFactor, scaleFactor);

    context.globalCompositeOperation = 'destination-over';
    context.drawImage(
      image.resource,
      position.x,
      position.y,
      position.width,
      position.height
    );

    const backgroundColor = this.backgroundColor();
    if (backgroundColor) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    context.restore();
  }

  private calculatePosition(image = this.stateImage()) {
    const [borderX, borderY] = this.bordersNormalized();

    if (!image?.width || !image?.height) {
      throw new Error('Image dimension is unknown.');
    }

    const croppingRect = this.getCroppingRect();

    const width = image.width * this.scale();
    const height = image.height * this.scale();

    let x = -croppingRect.x * width;
    let y = -croppingRect.y * height;

    if (this.isVertical()) {
      x += borderY;
      y += borderX;
    } else {
      x += borderX;
      y += borderY;
    }

    return { x, y, height, width };
  }

  private getCroppingRect() {
    const position = this.position() || {
      x: this.stateImage().x,
      y: this.stateImage().y,
    };
    const width = (1 / this.scale()) * this.getXScale();
    const height = (1 / this.scale()) * this.getYScale();

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

    return {
      ...croppingRect,
      x: Math.max(xMin, Math.min(croppingRect.x, xMax)),
      y: Math.max(yMin, Math.min(croppingRect.y, yMax)),
    };
  }

  private getXScale() {
    const stateImage = this.stateImage();

    if (!stateImage.width || !stateImage.height)
      throw new Error('Image dimension is unknown.');

    const canvasAspect = this.width() / this.height();
    const imageAspect = stateImage.width / stateImage.height;

    return Math.min(1, canvasAspect / imageAspect);
  }

  private getYScale() {
    const stateImage = this.stateImage();

    if (!stateImage.width || !stateImage.height)
      throw new Error('Image dimension is unknown.');

    const canvasAspect = this.height() / this.width();
    const imageAspect = stateImage.height / stateImage.width;

    return Math.min(1, canvasAspect / imageAspect);
  }

  private handleMouseMove(e: MouseEvent | TouchEvent) {
    if (!this.stateDrag()) {
      return;
    }

    e.preventDefault(); // stop scrolling on iOS Safari

    const mousePositionX =
      'targetTouches' in e ? e.targetTouches[0].pageX : e.clientX;
    const mousePositionY =
      'targetTouches' in e ? e.targetTouches[0].pageY : e.clientY;

    this.stateMx.set(mousePositionX);
    this.stateMy.set(mousePositionY);

    let rotate = this.rotate();
    rotate %= 360;
    rotate = rotate < 0 ? rotate + 360 : rotate;

    const stateMx = this.stateMx();
    const stateMy = this.stateMy();
    const stateImage = this.stateImage();
    if (stateMx && stateMy && stateImage?.width && stateImage?.height) {
      const mx = stateMx - mousePositionX;
      const my = stateMy - mousePositionY;

      const width = stateImage.width * this.scale();
      const height = stateImage.height * this.scale();

      let { x: lastX, y: lastY } = this.getCroppingRect();

      lastX *= width;
      lastY *= height;

      // helpers to calculate vectors
      const toRadians = (degree: number) => degree * (Math.PI / 180);
      const cos = Math.cos(toRadians(rotate));
      const sin = Math.sin(toRadians(rotate));

      const x = lastX + mx * cos + my * sin;
      const y = lastY + -mx * sin + my * cos;

      const relativeWidth = (1 / this.scale()) * this.getXScale();
      const relativeHeight = (1 / this.scale()) * this.getYScale();

      const position = {
        x: x / width + relativeWidth / 2,
        y: y / height + relativeHeight / 2,
      };

      this.onPositionChange.emit(position);

      this.stateImage.set({
        ...this.stateImage(),
        ...position,
      });
    }

    this.onMouseMove.emit(e);
  }

  private handleMouseUp() {
    if (this.stateDrag()) {
      this.stateDrag.set(false);
      this.onMouseUp.emit();
    }
  }
}
