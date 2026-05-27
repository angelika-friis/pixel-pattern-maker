import type { OutputInfo } from '../../domain/pixelGrid';

type DrawPixelArtOptions = {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  outputInfo: OutputInfo;
  cellSize: number;
  showGrid: boolean;
  gridColor: string;
};

export function drawPixelArt({
  canvas,
  image,
  outputInfo,
  cellSize,
  showGrid,
  gridColor,
}: DrawPixelArtOptions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const targetWidth = outputInfo.cols * cellSize;
  const targetHeight = outputInfo.rows * cellSize;
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const { cols, rows } = outputInfo;
  const sampleCanvas = document.createElement('canvas');
  const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
  if (!sampleCtx) {
    return;
  }

  sampleCanvas.width = cols;
  sampleCanvas.height = rows;

  sampleCtx.imageSmoothingEnabled = true;
  sampleCtx.drawImage(image, 0, 0, cols, rows);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sampleCanvas, 0, 0, cols, rows, 0, 0, targetWidth, targetHeight);

  if (!showGrid) {
    return;
  }

  ctx.save();
  ctx.strokeStyle = gridColor;
  ctx.globalAlpha = 0.42;
  ctx.lineWidth = 1;

  for (let x = 0; x <= targetWidth; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, targetHeight);
    ctx.stroke();
  }

  for (let y = 0; y <= targetHeight; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(targetWidth, y + 0.5);
    ctx.stroke();
  }

  ctx.restore();
}
