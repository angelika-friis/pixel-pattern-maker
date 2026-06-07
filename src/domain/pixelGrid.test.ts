import { describe, expect, it } from 'vitest';
import { getZoomedPreviewInfo } from './pixelGrid';

describe('getZoomedPreviewInfo', () => {
  it('snaps zoomed cells to whole canvas pixels', () => {
    const previewInfo = {
      cellSize: 7,
      width: 70,
      height: 35,
      scale: 7 / 12,
    };

    const zoomedPreviewInfo = getZoomedPreviewInfo(previewInfo, 1.25);

    expect(zoomedPreviewInfo).toMatchObject({
      cellSize: 9,
      width: 90,
      height: 45,
    });
    expect(zoomedPreviewInfo.scale).toBeCloseTo(9 / 12);
  });
});
