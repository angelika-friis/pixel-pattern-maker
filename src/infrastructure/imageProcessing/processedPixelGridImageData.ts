import type { OutputInfo } from '../../domain/pixelGrid';
import { adjustImageDataSaturation } from './adjustImageDataSaturation';
import { getQuantizedImageData } from './quantizeImageData';

type ProcessedPixelGridImageDataOptions = {
  image: HTMLImageElement;
  outputInfo: OutputInfo;
  colorCount: number;
  colorSaturation: number;
};

export function getProcessedPixelGridImageData({
  image,
  outputInfo,
  colorCount,
  colorSaturation,
}: ProcessedPixelGridImageDataOptions) {
  const imageData = getQuantizedImageData(image, outputInfo, colorCount);

  return imageData ? adjustImageDataSaturation(imageData, colorSaturation) : null;
}
