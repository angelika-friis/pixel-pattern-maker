import { useMemo } from 'react';
import type { PreviewBounds } from '../domain/pixelGrid';
import { getOutputInfo, getPreviewInfo } from '../domain/pixelGrid';
import { getPixelColors } from '../infrastructure/imageProcessing/pixelColors';
import { getProcessedPixelGridImageData } from '../infrastructure/imageProcessing/processedPixelGridImageData';

type PixelGridDataOptions = {
  image: HTMLImageElement | null;
  pixelSize: number;
  colorCount: number;
  colorSaturation: number;
  imageContrast: number;
  previewBounds: PreviewBounds;
};

export function usePixelGridData({
  image,
  pixelSize,
  colorCount,
  colorSaturation,
  imageContrast,
  previewBounds,
}: PixelGridDataOptions) {
  const outputInfo = useMemo(() => {
    return image ? getOutputInfo(image, pixelSize) : null;
  }, [image, pixelSize]);

  const previewInfo = useMemo(() => {
    return outputInfo ? getPreviewInfo(outputInfo, pixelSize, previewBounds) : null;
  }, [outputInfo, pixelSize, previewBounds]);

  const processedImageData = useMemo(() => {
    return image && outputInfo
      ? getProcessedPixelGridImageData({
          image,
          outputInfo,
          colorCount,
          colorSaturation,
          imageContrast,
        })
      : null;
  }, [colorCount, colorSaturation, image, imageContrast, outputInfo]);

  const pixelColors = useMemo(() => {
    return processedImageData ? getPixelColors(processedImageData) : [];
  }, [processedImageData]);

  return {
    outputInfo,
    pixelColors,
    processedImageData,
    previewInfo,
  };
}
