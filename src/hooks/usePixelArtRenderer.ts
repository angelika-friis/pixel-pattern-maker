import { useCallback, useEffect } from 'react';
import type { RefObject } from 'react';
import type { OutputInfo, PreviewInfo } from '../domain/pixelGrid';
import { drawPixelArt } from '../infrastructure/canvas/drawPixelArt';

type PixelArtRendererOptions = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  outputInfo: OutputInfo | null;
  processedImageData: ImageData | null;
  previewInfo: PreviewInfo | null;
  showGrid: boolean;
  gridColor: string;
  selectedColorHexes: string[];
};

export function usePixelArtRenderer({
  canvasRef,
  outputInfo,
  processedImageData,
  previewInfo,
  showGrid,
  gridColor,
  selectedColorHexes,
}: PixelArtRendererOptions) {
  const renderPixelArt = useCallback(
    (cellSize: number, targetCanvas: HTMLCanvasElement) => {
      if (!outputInfo || !processedImageData) {
        return;
      }

      drawPixelArt({
        canvas: targetCanvas,
        imageData: processedImageData,
        outputInfo,
        cellSize,
        showGrid,
        gridColor,
        selectedColorHexes,
      });
    },
    [gridColor, outputInfo, processedImageData, selectedColorHexes, showGrid],
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && previewInfo) {
      renderPixelArt(previewInfo.cellSize, canvas);
    }
  }, [canvasRef, previewInfo, renderPixelArt]);
}
