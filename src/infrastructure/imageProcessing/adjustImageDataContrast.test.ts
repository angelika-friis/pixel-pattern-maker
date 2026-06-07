import { describe, expect, it } from 'vitest';
import { adjustImageDataContrast } from './adjustImageDataContrast';

function createTestImageData(data: number[]) {
  return { data: new Uint8ClampedArray(data) } as ImageData;
}

describe('adjustImageDataContrast', () => {
  it('keeps colors unchanged at 100 percent', () => {
    const imageData = createTestImageData([120, 80, 40, 255]);

    adjustImageDataContrast(imageData, 100);

    expect(Array.from(imageData.data)).toEqual([120, 80, 40, 255]);
  });

  it('reduces opaque color contrast at 0 percent and preserves transparency', () => {
    const imageData = createTestImageData([200, 40, 120, 255, 10, 20, 30, 0]);

    adjustImageDataContrast(imageData, 0);

    expect(Array.from(imageData.data)).toEqual([128, 128, 128, 255, 10, 20, 30, 0]);
  });

  it('increases contrast around the midpoint', () => {
    const imageData = createTestImageData([160, 96, 128, 255]);

    adjustImageDataContrast(imageData, 150);

    expect(Array.from(imageData.data)).toEqual([176, 80, 128, 255]);
  });
});
