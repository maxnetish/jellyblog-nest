import { ImageState } from './image-state';

export function paintImage({context, image, scaleFactor, calculatedPosition, rotate, isVertical, imageFillStyle}: {
  context: CanvasRenderingContext2D,
  image: ImageState,
  // pixelRatio
  scaleFactor: number,
  calculatedPosition: { x: number, y: number, height: number, width: number };
  rotate: number;
  isVertical: boolean;
  imageFillStyle?: CanvasFillStrokeStyles['fillStyle'];
}) {
  if (!image.resource) return;

  const position = calculatedPosition;

  context.save();

  context.translate(context.canvas.width / 2, context.canvas.height / 2);
  context.rotate((rotate * Math.PI) / 180);
  context.translate(
    -(context.canvas.width / 2),
    -(context.canvas.height / 2),
  );

  if (isVertical) {
    context.translate(
      (context.canvas.width - context.canvas.height) / 2,
      (context.canvas.height - context.canvas.width) / 2,
    );
  }

  context.scale(scaleFactor, scaleFactor);

  context.globalCompositeOperation = 'destination-over';
  context.drawImage(
    image.resource,
    position.x,
    position.y,
    position.width,
    position.height,
  );

  if (imageFillStyle) {
    context.fillStyle = imageFillStyle;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  context.restore();
}
