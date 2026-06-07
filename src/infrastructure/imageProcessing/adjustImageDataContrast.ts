import { clamp } from '../../domain/pixelGrid';

const ORIGINAL_CONTRAST_PERCENT = 100;
const RGB_MAX = 255;
const RGB_MIDPOINT = 128;

function adjustColorChannelContrast(value: number, contrastFactor: number) {
  return Math.round(clamp((value - RGB_MIDPOINT) * contrastFactor + RGB_MIDPOINT, 0, RGB_MAX));
}

export function adjustImageDataContrast(imageData: ImageData, contrastPercent: number) {
  if (contrastPercent === ORIGINAL_CONTRAST_PERCENT) {
    return imageData;
  }

  const contrastFactor = contrastPercent / ORIGINAL_CONTRAST_PERCENT;
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] === 0) {
      continue;
    }

    data[index] = adjustColorChannelContrast(data[index], contrastFactor);
    data[index + 1] = adjustColorChannelContrast(data[index + 1], contrastFactor);
    data[index + 2] = adjustColorChannelContrast(data[index + 2], contrastFactor);
  }

  return imageData;
}
