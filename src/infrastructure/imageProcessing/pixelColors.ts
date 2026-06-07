import type { PixelColor } from '../../domain/pixelGrid';
import { toHex } from './colorValues';

export function getPixelColors(imageData: ImageData): PixelColor[] {
  const colors = new Map<string, number>();

  for (let index = 0; index < imageData.data.length; index += 4) {
    const alpha = imageData.data[index + 3];
    const hex =
      alpha === 0
        ? 'transparent'
        : `#${toHex(imageData.data[index])}${toHex(imageData.data[index + 1])}${toHex(
            imageData.data[index + 2],
          )}`;

    colors.set(hex, (colors.get(hex) ?? 0) + 1);
  }

  return Array.from(colors, ([hex, count]) => ({ hex, count })).sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }

    return a.hex.localeCompare(b.hex);
  });
}
