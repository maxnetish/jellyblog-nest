import { drawRoundedRect } from './draw-rounded-rect';
import { drawGrid } from './draw-grid';

export function paintBackground({
  context,
  pixelRatio,
  backgroundTransparency,
  borderRadius,
  borderSize,
  dimensionCanvasHeight,
  dimensionCanvasWidth,
  borderStrokeStyle,
  showGrid,
  gridFillStyle,
}: {
  context: CanvasRenderingContext2D;
  pixelRatio: number;
  backgroundTransparency: number;
  borderRadius: number;
  borderSize: [number, number];
  dimensionCanvasHeight: number;
  dimensionCanvasWidth: number;
  borderStrokeStyle?: CanvasFillStrokeStyles['strokeStyle'];
  showGrid: boolean;
  gridFillStyle: CanvasFillStrokeStyles['fillStyle'];
}) {
  context.save();
  context.scale(pixelRatio, pixelRatio);
  context.translate(0, 0);
  context.fillStyle = `rgba(0,0,0,${backgroundTransparency})`;

  let borderRadiusLocal = borderRadius;
  const [borderSizeX, borderSizeY] = borderSize;
  const height = dimensionCanvasHeight;
  const width = dimensionCanvasWidth;

  // clamp border radius between zero (perfect rectangle) and half the size without borders (perfect circle or "pill")
  borderRadiusLocal = Math.max(borderRadiusLocal, 0);
  borderRadiusLocal = Math.min(
    borderRadiusLocal,
    width / 2 - borderSizeX,
    height / 2 - borderSizeY,
  );

  context.beginPath();
  // inner rect, possibly rounded
  drawRoundedRect(
    context,
    borderSizeX,
    borderSizeY,
    width - borderSizeX * 2,
    height - borderSizeY * 2,
    borderRadiusLocal,
  );
  context.rect(width, 0, -width, height); // outer rect, drawn "counterclockwise"
  context.fill('evenodd');

  // Draw 1px border around the mask only if borderColor is provided
  if (borderStrokeStyle) {
    context.strokeStyle = borderStrokeStyle;
    context.lineWidth = 1;
    context.beginPath();
    drawRoundedRect(
      context,
      borderSizeX + 0.5,
      borderSizeY + 0.5,
      width - borderSizeX * 2 - 1,
      height - borderSizeY * 2 - 1,
      borderRadiusLocal,
    );
    context.stroke();
  }

  if (showGrid) {
    drawGrid(
      context,
      borderSizeX,
      borderSizeY,
      width - borderSizeX * 2,
      height - borderSizeY * 2,
      gridFillStyle,
    );
  }
  context.restore();
}
