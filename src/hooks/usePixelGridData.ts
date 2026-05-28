import { useMemo } from 'react';
import type { PreviewBounds } from '../domain/pixelGrid';
import { getOutputInfo, getPreviewInfo } from '../domain/pixelGrid';
import { getPixelColors } from '../infrastructure/imageProcessing/pixelColors';

type PixelGridDataOptions = {
  image: HTMLImageElement | null;
  pixelSize: number;
  colorCount: number;
  previewBounds: PreviewBounds;
};

export function usePixelGridData({
  image,
  pixelSize,
  colorCount,
  previewBounds,
}: PixelGridDataOptions) {
  const outputInfo = useMemo(() => {
    return image ? getOutputInfo(image, pixelSize) : null;
  }, [image, pixelSize]);

  const previewInfo = useMemo(() => {
    return outputInfo ? getPreviewInfo(outputInfo, pixelSize, previewBounds) : null;
  }, [outputInfo, pixelSize, previewBounds]);

  const pixelColors = useMemo(() => {
    return image && outputInfo ? getPixelColors(image, outputInfo, colorCount) : [];
  }, [colorCount, image, outputInfo]);

  return {
    outputInfo,
    pixelColors,
    previewInfo,
  };
}
