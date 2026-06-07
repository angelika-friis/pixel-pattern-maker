import type { OutputInfo } from '../../domain/pixelGrid';
import { getColorSelectionImageData } from '../imageProcessing/filterImageDataByColor';
import { drawGridLines } from './drawGridLines';

type DrawPixelArtOptions = {
  canvas: HTMLCanvasElement;
  imageData: ImageData;
  outputInfo: OutputInfo;
  cellSize: number;
  showGrid: boolean;
  gridColor: string;
  selectedColorHexes?: string[];
};

export function drawPixelArt({
  canvas,
  imageData,
  outputInfo,
  cellSize,
  showGrid,
  gridColor,
  selectedColorHexes = [],
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
  const displayImageData =
    selectedColorHexes.length > 0
      ? getColorSelectionImageData(imageData, selectedColorHexes)
      : imageData;

  const sampleCanvas = document.createElement('canvas');
  const sampleCtx = sampleCanvas.getContext('2d');
  if (!sampleCtx) {
    return;
  }

  sampleCanvas.width = cols;
  sampleCanvas.height = rows;
  sampleCtx.putImageData(displayImageData, 0, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sampleCanvas, 0, 0, cols, rows, 0, 0, targetWidth, targetHeight);

  if (!showGrid) {
    return;
  }

  drawGridLines({ ctx, width: targetWidth, height: targetHeight, cellSize, gridColor });
}
