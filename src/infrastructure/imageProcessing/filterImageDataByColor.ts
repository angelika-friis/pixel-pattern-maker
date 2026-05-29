import { toHex } from './colorValues';

function getPixelHex(data: Uint8ClampedArray, index: number) {
  const alpha = data[index + 3];

  if (alpha === 0) {
    return 'transparent';
  }

  return `#${toHex(data[index])}${toHex(data[index + 1])}${toHex(data[index + 2])}`;
}

export function getColorSelectionImageData(imageData: ImageData, selectedColorHexes: string[]) {
  const filteredImageData = new ImageData(imageData.width, imageData.height);
  const selectedColors = new Set(selectedColorHexes);

  for (let index = 0; index < imageData.data.length; index += 4) {
    if (!selectedColors.has(getPixelHex(imageData.data, index))) {
      continue;
    }

    filteredImageData.data[index] = 0;
    filteredImageData.data[index + 1] = 0;
    filteredImageData.data[index + 2] = 0;
    filteredImageData.data[index + 3] = 255;
  }

  return filteredImageData;
}
