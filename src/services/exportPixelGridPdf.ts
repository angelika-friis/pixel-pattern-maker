import type { OutputInfo, PixelColor } from '../domain/pixelGrid';
import { createPaletteCanvas } from '../infrastructure/canvas/createPaletteCanvas';
import { drawPixelArt } from '../infrastructure/canvas/drawPixelArt';
import { createMultiPagePdfBlob } from '../infrastructure/pdf/createPdfBlob';
import { createColorSymbols } from '../infrastructure/pattern/colorSymbols';
import { createSymbolPatternCanvas } from '../infrastructure/pattern/createSymbolPatternCanvas';

type PixelGridPdfOptions = {
  imageData: ImageData;
  outputInfo: OutputInfo;
  pixelSize: number;
  showGrid: boolean;
  gridColor: string;
  pixelColors: PixelColor[];
};

function getVisiblePixelColors(pixelColors: PixelColor[]) {
  return pixelColors.filter((color) => color.hex !== 'transparent');
}

export function createPixelGridPdfBlob({
  imageData,
  outputInfo,
  pixelSize,
  showGrid,
  gridColor,
  pixelColors,
}: PixelGridPdfOptions) {
  const exportCanvas = document.createElement('canvas');
  const visiblePixelColors = getVisiblePixelColors(pixelColors);
  const pixelColorSymbols = createColorSymbols(visiblePixelColors);

  drawPixelArt({
    canvas: exportCanvas,
    imageData,
    outputInfo,
    cellSize: pixelSize,
    showGrid,
    gridColor,
  });

  return createMultiPagePdfBlob([
    exportCanvas,
    createPaletteCanvas(visiblePixelColors),
    createSymbolPatternCanvas({
      imageData,
      outputInfo,
      cellSize: pixelSize,
      pixelColors: pixelColorSymbols,
      gridColor,
    }),
    createPaletteCanvas(pixelColorSymbols, { showSymbols: true }),
  ]);
}

export function getPixelGridPdfFileName(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, '') || 'pixel-grid';

  return `${baseName}-pixel-grid.pdf`;
}
