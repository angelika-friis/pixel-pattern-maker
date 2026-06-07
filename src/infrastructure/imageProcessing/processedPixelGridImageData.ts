import type { OutputInfo } from '../../domain/pixelGrid';
import { adjustImageDataContrast } from './adjustImageDataContrast';
import { adjustImageDataSaturation } from './adjustImageDataSaturation';
import { getQuantizedImageData } from './quantizeImageData';

type ProcessedPixelGridImageDataOptions = {
  image: HTMLImageElement;
  outputInfo: OutputInfo;
  colorCount: number;
  colorSaturation: number;
  imageContrast: number;
};

export function getProcessedPixelGridImageData({
  image,
  outputInfo,
  colorCount,
  colorSaturation,
  imageContrast,
}: ProcessedPixelGridImageDataOptions) {
  const imageData = getQuantizedImageData(image, outputInfo, colorCount);

  if (!imageData) {
    return null;
  }

  adjustImageDataSaturation(imageData, colorSaturation);

  return adjustImageDataContrast(imageData, imageContrast);
}
