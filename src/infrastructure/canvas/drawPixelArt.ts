import type { OutputInfo } from '../../domain/pixelGrid';

type DrawPixelArtOptions = {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  outputInfo: OutputInfo;
  cellSize: number;
  showGrid: boolean;
  gridColor: string;
};

export type PixelColor = {
  hex: string;
  count: number;
};

function createSampleCanvas(image: HTMLImageElement, outputInfo: OutputInfo) {
  const sampleCanvas = document.createElement('canvas');
  const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
  if (!sampleCtx) {
    return null;
  }

  sampleCanvas.width = outputInfo.cols;
  sampleCanvas.height = outputInfo.rows;

  sampleCtx.imageSmoothingEnabled = true;
  sampleCtx.drawImage(image, 0, 0, outputInfo.cols, outputInfo.rows);

  return { sampleCanvas, sampleCtx };
}

function toHex(value: number) {
  return value.toString(16).padStart(2, '0');
}

export function getPixelColors(image: HTMLImageElement, outputInfo: OutputInfo): PixelColor[] {
  const sample = createSampleCanvas(image, outputInfo);
  if (!sample) {
    return [];
  }

  const imageData = sample.sampleCtx.getImageData(0, 0, outputInfo.cols, outputInfo.rows);
  const colors = new Map<string, number>();

  for (let index = 0; index < imageData.data.length; index += 4) {
    const alpha = imageData.data[index + 3];
    const hex =
      alpha === 0
        ? 'transparent'
        : `#${toHex(imageData.data[index])}${toHex(imageData.data[index + 1])}${toHex(
            imageData.data[index + 2],
          )}`;

    colors.set(hex, (colors.get(hex) ?? 0) + 1);
  }

  return Array.from(colors, ([hex, count]) => ({ hex, count })).sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }

    return a.hex.localeCompare(b.hex);
  });
}

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
  const sample = createSampleCanvas(image, outputInfo);
  if (!sample) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sample.sampleCanvas, 0, 0, cols, rows, 0, 0, targetWidth, targetHeight);

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
