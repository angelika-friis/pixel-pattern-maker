import { useRef } from 'react';
import { usePixelArtRenderer } from './usePixelArtRenderer';
import { usePixelGridData } from './usePixelGridData';
import { useResizeObserver } from './useResizeObserver';

type PixelArtPreviewOptions = {
  image: HTMLImageElement | null;
  pixelSize: number;
  colorCount: number;
  colorSaturation: number;
  showGrid: boolean;
  gridColor: string;
  selectedColorHexes: string[];
};

export function usePixelArtPreview({
  image,
  pixelSize,
  colorCount,
  colorSaturation,
  showGrid,
  gridColor,
  selectedColorHexes,
}: PixelArtPreviewOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewRef = useRef<HTMLElement | null>(null);
  const previewBounds = useResizeObserver(previewRef);
  const { outputInfo, pixelColors, previewInfo, processedImageData } = usePixelGridData({
    image,
    pixelSize,
    colorCount,
    colorSaturation,
    previewBounds,
  });

  usePixelArtRenderer({
    canvasRef,
    outputInfo,
    processedImageData,
    previewInfo,
    showGrid,
    gridColor,
    selectedColorHexes,
  });

  return {
    canvasRef,
    outputInfo,
    pixelColors,
    processedImageData,
    previewInfo,
    previewRef,
  };
}
