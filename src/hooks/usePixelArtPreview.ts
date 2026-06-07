import { useRef } from 'react';
import { getZoomedPreviewInfo } from '../domain/pixelGrid';
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
  previewZoom: number;
  selectedColorHexes: string[];
};

export function usePixelArtPreview({
  image,
  pixelSize,
  colorCount,
  colorSaturation,
  showGrid,
  gridColor,
  previewZoom,
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
  const zoomedPreviewInfo = previewInfo ? getZoomedPreviewInfo(previewInfo, previewZoom) : null;

  usePixelArtRenderer({
    canvasRef,
    outputInfo,
    processedImageData,
    previewInfo: zoomedPreviewInfo,
    showGrid,
    gridColor,
    selectedColorHexes,
  });

  return {
    canvasRef,
    outputInfo,
    pixelColors,
    processedImageData,
    previewInfo: zoomedPreviewInfo,
    previewRef,
  };
}
