import { useRef } from 'react';
import { usePixelArtRenderer } from './usePixelArtRenderer';
import { usePixelGridData } from './usePixelGridData';
import { useResizeObserver } from './useResizeObserver';

type PixelArtPreviewOptions = {
  image: HTMLImageElement | null;
  pixelSize: number;
  colorCount: number;
  showGrid: boolean;
  gridColor: string;
};

export function usePixelArtPreview({
  image,
  pixelSize,
  colorCount,
  showGrid,
  gridColor,
}: PixelArtPreviewOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewRef = useRef<HTMLElement | null>(null);
  const previewBounds = useResizeObserver(previewRef);
  const { outputInfo, pixelColors, previewInfo } = usePixelGridData({
    image,
    pixelSize,
    colorCount,
    previewBounds,
  });

  usePixelArtRenderer({
    canvasRef,
    image,
    outputInfo,
    previewInfo,
    colorCount,
    showGrid,
    gridColor,
  });

  return {
    canvasRef,
    outputInfo,
    pixelColors,
    previewInfo,
    previewRef,
  };
}
