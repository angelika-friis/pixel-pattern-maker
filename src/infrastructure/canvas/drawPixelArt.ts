import type { OutputInfo } from '../../domain/pixelGrid';

type DrawPixelArtOptions = {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  outputInfo: OutputInfo;
  cellSize: number;
  colorCount: number;
  showGrid: boolean;
  gridColor: string;
};

export type PixelColor = {
  hex: string;
  count: number;
};

function createSampleCanvas(image: HTMLImageElement, outputInfo: OutputInfo) {
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

function toHex(value: number) {
  return value.toString(16).padStart(2, '0');
}

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

function getColorDistance(a: RgbColor, b: RgbColor) {
  const red = a.r - b.r;
  const green = a.g - b.g;
  const blue = a.b - b.b;

  return red * red + green * green + blue * blue;
}

function getInitialPalette(colors: RgbColor[], colorCount: number): RgbColor[] {
  const uniqueColors = new Map<string, RgbColor>();

  for (const color of colors) {
    uniqueColors.set(`${color.r},${color.g},${color.b}`, color);
  }

  const palette = Array.from(uniqueColors.values());
  if (palette.length <= colorCount) {
    return palette;
  }

  const sortedByLuminance = [...palette].sort((a, b) => {
    const luminanceA = 0.2126 * a.r + 0.7152 * a.g + 0.0722 * a.b;
    const luminanceB = 0.2126 * b.r + 0.7152 * b.g + 0.0722 * b.b;

    return luminanceA - luminanceB;
  });

  return Array.from({ length: colorCount }, (_, index) => {
    const paletteIndex =
      colorCount === 1
        ? Math.floor(sortedByLuminance.length / 2)
        : Math.round((index * (sortedByLuminance.length - 1)) / (colorCount - 1));

    return sortedByLuminance[paletteIndex];
  });
}

function findClosestPaletteIndex(color: RgbColor, palette: RgbColor[]) {
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < palette.length; index += 1) {
    const distance = getColorDistance(color, palette[index]);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  }

  return closestIndex;
}

function quantizeImageData(imageData: ImageData, colorCount: number) {
  const data = imageData.data;
  const transparentPixels: number[] = [];
  const opaqueColors: RgbColor[] = [];

  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] === 0) {
      transparentPixels.push(index);
    } else {
      opaqueColors.push({
        r: data[index],
        g: data[index + 1],
        b: data[index + 2],
      });
    }
  }

  const opaqueColorCount = Math.max(0, colorCount - (transparentPixels.length > 0 ? 1 : 0));
  if (opaqueColors.length === 0 || opaqueColorCount === 0) {
    for (let index = 0; index < data.length; index += 4) {
      data[index + 3] = 0;
    }

    return imageData;
  }

  let palette = getInitialPalette(opaqueColors, opaqueColorCount);

  for (let iteration = 0; iteration < 8; iteration += 1) {
    const totals = palette.map(() => ({ r: 0, g: 0, b: 0, count: 0 }));

    for (const color of opaqueColors) {
      const paletteIndex = findClosestPaletteIndex(color, palette);
      const total = totals[paletteIndex];
      total.r += color.r;
      total.g += color.g;
      total.b += color.b;
      total.count += 1;
    }

    palette = palette.map((color, index) => {
      const total = totals[index];
      if (total.count === 0) {
        return color;
      }

      return {
        r: Math.round(total.r / total.count),
        g: Math.round(total.g / total.count),
        b: Math.round(total.b / total.count),
      };
    });
  }

  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] === 0) {
      continue;
    }

    const paletteColor = palette[
      findClosestPaletteIndex(
        {
          r: data[index],
          g: data[index + 1],
          b: data[index + 2],
        },
        palette,
      )
    ];

    data[index] = paletteColor.r;
    data[index + 1] = paletteColor.g;
    data[index + 2] = paletteColor.b;
    data[index + 3] = 255;
  }

  return imageData;
}

export function getQuantizedImageData(
  image: HTMLImageElement,
  outputInfo: OutputInfo,
  colorCount: number,
) {
  const sample = createSampleCanvas(image, outputInfo);
  if (!sample) {
    return null;
  }

  const imageData = sample.sampleCtx.getImageData(0, 0, outputInfo.cols, outputInfo.rows);

  return quantizeImageData(imageData, colorCount);
}

export function getPixelColors(
  image: HTMLImageElement,
  outputInfo: OutputInfo,
  colorCount: number,
): PixelColor[] {
  const imageData = getQuantizedImageData(image, outputInfo, colorCount);
  if (!imageData) {
    return [];
  }

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

export function drawPixelArt({
  canvas,
  image,
  outputInfo,
  cellSize,
  colorCount,
  showGrid,
  gridColor,
}: DrawPixelArtOptions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const targetWidth = outputInfo.cols * cellSize;
  const targetHeight = outputInfo.rows * cellSize;
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const { cols, rows } = outputInfo;
  const imageData = getQuantizedImageData(image, outputInfo, colorCount);
  if (!imageData) {
    return;
  }

  const sampleCanvas = document.createElement('canvas');
  const sampleCtx = sampleCanvas.getContext('2d');
  if (!sampleCtx) {
    return;
  }

  sampleCanvas.width = cols;
  sampleCanvas.height = rows;
  sampleCtx.putImageData(imageData, 0, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sampleCanvas, 0, 0, cols, rows, 0, 0, targetWidth, targetHeight);

  if (!showGrid) {
    return;
  }

  ctx.save();
  ctx.strokeStyle = gridColor;
  ctx.globalAlpha = 0.42;
  ctx.lineWidth = 1;

  for (let x = 0; x <= targetWidth; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, targetHeight);
    ctx.stroke();
  }

  for (let y = 0; y <= targetHeight; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(targetWidth, y + 0.5);
    ctx.stroke();
  }

  ctx.restore();
}
