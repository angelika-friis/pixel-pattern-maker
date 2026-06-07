export const DEFAULT_PIXEL_SIZE = 12;
export const DEFAULT_COLOR_COUNT = 16;
export const DEFAULT_COLOR_SATURATION = 100;
export const DEFAULT_PREVIEW_ZOOM = 1;
export const MIN_PREVIEW_ZOOM = 1;
export const MAX_PREVIEW_ZOOM = 4;
export const PREVIEW_ZOOM_STEP = 0.25;
export const MIN_COLOR_COUNT = 2;
export const MAX_COLOR_COUNT = 64;
export const MIN_COLOR_SATURATION = 0;
export const MAX_COLOR_SATURATION = 200;
export const MAX_CANVAS_EDGE = 1600;

export type ImageSize = {
  width: number;
  height: number;
};

export type OutputInfo = ImageSize & {
  cols: number;
  rows: number;
};

export type PreviewBounds = ImageSize;

export type PreviewInfo = ImageSize & {
  cellSize: number;
  scale: number;
};

export type PixelColor = {
  hex: string;
  count: number;
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getContainedSize(width: number, height: number, maxEdge: number): ImageSize {
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function getOutputInfo(
  image: Pick<HTMLImageElement, 'width' | 'height'>,
  pixelSize: number,
): OutputInfo {
  const size = getContainedSize(image.width, image.height, MAX_CANVAS_EDGE);
  const cols = Math.ceil(size.width / pixelSize);
  const rows = Math.ceil(size.height / pixelSize);

  return {
    cols,
    rows,
    width: cols * pixelSize,
    height: rows * pixelSize,
  };
}

export function getPreviewInfo(
  outputInfo: OutputInfo,
  pixelSize: number,
  previewBounds: PreviewBounds,
): PreviewInfo | null {
  if (previewBounds.width <= 0 || previewBounds.height <= 0) {
    return null;
  }

  const paddedWidth = Math.max(1, previewBounds.width - 48);
  const paddedHeight = Math.max(1, previewBounds.height - 48);
  const fitCellSize = Math.floor(
    Math.min(pixelSize, paddedWidth / outputInfo.cols, paddedHeight / outputInfo.rows),
  );
  const cellSize = Math.max(1, fitCellSize);

  return {
    cellSize,
    width: outputInfo.cols * cellSize,
    height: outputInfo.rows * cellSize,
    scale: cellSize / pixelSize,
  };
}
