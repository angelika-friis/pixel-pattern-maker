import type { OutputInfo, PixelColor } from '../domain/pixelGrid';
import { drawPixelArt } from '../infrastructure/canvas/drawPixelArt';
import { createPaletteCanvas } from '../infrastructure/pdf/createPaletteCanvas';
import { createMultiPagePdfBlob } from '../infrastructure/pdf/createPdfBlob';
import { createColorSymbols } from '../infrastructure/pattern/colorSymbols';
import { createSymbolPatternCanvas } from '../infrastructure/pattern/createSymbolPatternCanvas';

type PixelGridPdfOptions = {
  image: HTMLImageElement;
  outputInfo: OutputInfo;
  pixelSize: number;
  colorCount: number;
  showGrid: boolean;
  gridColor: string;
  pixelColors: PixelColor[];
};

function getVisiblePixelColors(pixelColors: PixelColor[]) {
  return pixelColors.filter((color) => color.hex !== 'transparent');
}

export function createPixelGridPdfBlob({
  image,
  outputInfo,
  pixelSize,
  colorCount,
  showGrid,
  gridColor,
  pixelColors,
}: PixelGridPdfOptions) {
  const exportCanvas = document.createElement('canvas');
  const visiblePixelColors = getVisiblePixelColors(pixelColors);
  const pixelColorSymbols = createColorSymbols(visiblePixelColors);

  drawPixelArt({
    canvas: exportCanvas,
    image,
    outputInfo,
    cellSize: pixelSize,
    colorCount,
    showGrid,
    gridColor,
  });

  return createMultiPagePdfBlob([
    exportCanvas,
    createPaletteCanvas(visiblePixelColors),
    createSymbolPatternCanvas({
      image,
      outputInfo,
      cellSize: pixelSize,
      colorCount,
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
