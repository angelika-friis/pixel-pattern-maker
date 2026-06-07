import type { OutputInfo, PixelColor } from '../domain/pixelGrid';
import { createPaletteCanvas } from '../infrastructure/canvas/createPaletteCanvas';
import { drawPixelArt } from '../infrastructure/canvas/drawPixelArt';

type PixelGridPngOptions = {
  imageData: ImageData;
  outputInfo: OutputInfo;
  pixelSize: number;
  showGrid: boolean;
  gridColor: string;
  pixelColors: PixelColor[];
  selectedColorHexes: string[];
};

const EXPORT_PADDING = 32;
const EXPORT_GAP = 28;
const EXPORT_BACKGROUND = '#ffffff';

function getSelectedPixelColors(pixelColors: PixelColor[], selectedColorHexes: string[]) {
  const selectedColorHexSet = new Set(selectedColorHexes);

  return pixelColors.filter((color) => selectedColorHexSet.has(color.hex));
}

function createCombinedCanvas(pixelArtCanvas: HTMLCanvasElement, paletteCanvas: HTMLCanvasElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const contentWidth = Math.max(pixelArtCanvas.width, paletteCanvas.width);

  canvas.width = contentWidth + EXPORT_PADDING * 2;
  canvas.height = pixelArtCanvas.height + EXPORT_GAP + paletteCanvas.height + EXPORT_PADDING * 2;

  if (!ctx) {
    return canvas;
  }

  ctx.fillStyle = EXPORT_BACKGROUND;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    pixelArtCanvas,
    EXPORT_PADDING + (contentWidth - pixelArtCanvas.width) / 2,
    EXPORT_PADDING,
  );
  ctx.drawImage(
    paletteCanvas,
    EXPORT_PADDING + (contentWidth - paletteCanvas.width) / 2,
    EXPORT_PADDING + pixelArtCanvas.height + EXPORT_GAP,
  );

  return canvas;
}

function canvasToPngBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error('Kunde inte skapa PNG från canvas.'));
    }, 'image/png');
  });
}

export function createPixelGridPngBlob({
  imageData,
  outputInfo,
  pixelSize,
  showGrid,
  gridColor,
  pixelColors,
  selectedColorHexes,
}: PixelGridPngOptions) {
  const pixelArtCanvas = document.createElement('canvas');
  const selectedPixelColors = getSelectedPixelColors(pixelColors, selectedColorHexes);

  drawPixelArt({
    canvas: pixelArtCanvas,
    imageData,
    outputInfo,
    cellSize: pixelSize,
    showGrid,
    gridColor,
    selectedColorHexes,
  });

  return canvasToPngBlob(
    createCombinedCanvas(pixelArtCanvas, createPaletteCanvas(selectedPixelColors)),
  );
}

export function getPixelGridPngFileName(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, '') || 'pixel-grid';

  return `${baseName}-selected-colors.png`;
}
