import type { OutputInfo } from '../../domain/pixelGrid';

export function createSampleCanvas(image: HTMLImageElement, outputInfo: OutputInfo) {
  const sampleCanvas = document.createElement('canvas');
  const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
  if (!sampleCtx) {
    return null;
  }

  sampleCanvas.width = outputInfo.cols;
  sampleCanvas.height = outputInfo.rows;

  sampleCtx.imageSmoothingEnabled = true;
  sampleCtx.drawImage(image, 0, 0, outputInfo.cols, outputInfo.rows);

  return { sampleCanvas, sampleCtx };
}
