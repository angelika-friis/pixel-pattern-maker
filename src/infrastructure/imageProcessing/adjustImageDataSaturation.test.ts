import { describe, expect, it } from 'vitest';
import { adjustImageDataSaturation } from './adjustImageDataSaturation';

function createTestImageData(data: number[]) {
  return { data: new Uint8ClampedArray(data) } as ImageData;
}

describe('adjustImageDataSaturation', () => {
  it('keeps colors unchanged at 100 percent', () => {
    const imageData = createTestImageData([120, 80, 40, 255]);

    adjustImageDataSaturation(imageData, 100);

    expect(Array.from(imageData.data)).toEqual([120, 80, 40, 255]);
  });

  it('turns opaque colors grayscale at 0 percent and preserves transparency', () => {
    const imageData = createTestImageData([200, 40, 40, 255, 10, 20, 30, 0]);

    adjustImageDataSaturation(imageData, 0);

    expect(Array.from(imageData.data)).toEqual([111, 111, 111, 255, 10, 20, 30, 0]);
  });

  it('increases saturation by preserving hue and expanding channel contrast', () => {
    const imageData = createTestImageData([120, 80, 40, 255]);

    adjustImageDataSaturation(imageData, 200);

    expect(Array.from(imageData.data)).toEqual([130, 75, 0, 255]);
  });
});
