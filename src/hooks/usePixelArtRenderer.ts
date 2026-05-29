import { useCallback, useEffect } from 'react';
import type { RefObject } from 'react';
import type { OutputInfo, PreviewInfo } from '../domain/pixelGrid';
import { drawPixelArt } from '../infrastructure/canvas/drawPixelArt';

type PixelArtRendererOptions = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  image: HTMLImageElement | null;
  outputInfo: OutputInfo | null;
  previewInfo: PreviewInfo | null;
  colorCount: number;
  showGrid: boolean;
  gridColor: string;
  selectedColorHexes: string[];
};

export function usePixelArtRenderer({
  canvasRef,
  image,
  outputInfo,
  previewInfo,
  colorCount,
  showGrid,
  gridColor,
  selectedColorHexes,
}: PixelArtRendererOptions) {
  const renderPixelArt = useCallback(
    (cellSize: number, targetCanvas: HTMLCanvasElement) => {
      if (!image || !outputInfo) {
        return;
      }

      drawPixelArt({
        canvas: targetCanvas,
        image,
        outputInfo,
        cellSize,
        colorCount,
        showGrid,
        gridColor,
        selectedColorHexes,
      });
    },
    [colorCount, gridColor, image, outputInfo, selectedColorHexes, showGrid],
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && previewInfo) {
      renderPixelArt(previewInfo.cellSize, canvas);
    }
  }, [canvasRef, previewInfo, renderPixelArt]);
}
