import type { OutputInfo } from '../../domain/pixelGrid';
import { createColorSymbolMap, type PixelColorSymbol } from './colorSymbols';
import { drawGridLines } from '../canvas/drawGridLines';
import { toHex } from '../imageProcessing/colorValues';

type CreateSymbolPatternCanvasOptions = {
  imageData: ImageData;
  outputInfo: OutputInfo;
  cellSize: number;
  pixelColors: PixelColorSymbol[];
  gridColor: string;
};

function getPixelHex(imageData: ImageData, pixelIndex: number) {
  const dataIndex = pixelIndex * 4;
  const alpha = imageData.data[dataIndex + 3];

  if (alpha === 0) {
    return 'transparent';
  }

  return `#${toHex(imageData.data[dataIndex])}${toHex(imageData.data[dataIndex + 1])}${toHex(
    imageData.data[dataIndex + 2],
  )}`;
}

export function createSymbolPatternCanvas({
  imageData,
  outputInfo,
  cellSize,
  pixelColors,
  gridColor,
}: CreateSymbolPatternCanvasOptions) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const symbolByColor = createColorSymbolMap(pixelColors);
  const symbolCellSize = Math.max(cellSize, 18);

  canvas.width = outputInfo.cols * symbolCellSize;
  canvas.height = outputInfo.rows * symbolCellSize;

  if (!ctx) {
    return canvas;
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#111827';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `800 ${Math.max(10, Math.floor(symbolCellSize * 0.58))}px Inter, Arial, sans-serif`;

  for (let row = 0; row < outputInfo.rows; row += 1) {
    for (let col = 0; col < outputInfo.cols; col += 1) {
      const hex = getPixelHex(imageData, row * outputInfo.cols + col);
      const symbol = symbolByColor.get(hex);

      if (symbol) {
        ctx.fillText(
          symbol,
          col * symbolCellSize + symbolCellSize / 2,
          row * symbolCellSize + symbolCellSize / 2,
        );
      }
    }
  }

  drawGridLines({
    ctx,
    width: canvas.width,
    height: canvas.height,
    cellSize: symbolCellSize,
    gridColor,
  });

  return canvas;
}
