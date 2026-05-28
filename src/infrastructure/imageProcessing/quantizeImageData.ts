import type { OutputInfo } from '../../domain/pixelGrid';
import type { RgbColor } from './colorValues';
import { createSampleCanvas } from './sampleImage';

type ColorTotals = RgbColor & {
  count: number;
};

type ImageColorBuckets = {
  hasTransparentPixels: boolean;
  opaqueColors: RgbColor[];
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

function getImageColorBuckets(data: Uint8ClampedArray): ImageColorBuckets {
  let hasTransparentPixels = false;
  const opaqueColors: RgbColor[] = [];

  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] === 0) {
      hasTransparentPixels = true;
      continue;
    }

    opaqueColors.push({
      r: data[index],
      g: data[index + 1],
      b: data[index + 2],
    });
  }

  return { hasTransparentPixels, opaqueColors };
}

function getOpaqueColorCount(colorCount: number, hasTransparentPixels: boolean) {
  return Math.max(0, colorCount - (hasTransparentPixels ? 1 : 0));
}

function clearImageData(data: Uint8ClampedArray) {
  for (let index = 0; index < data.length; index += 4) {
    data[index + 3] = 0;
  }
}

function createEmptyColorTotals(): ColorTotals {
  return { r: 0, g: 0, b: 0, count: 0 };
}

function addColorToTotal(total: ColorTotals, color: RgbColor) {
  total.r += color.r;
  total.g += color.g;
  total.b += color.b;
  total.count += 1;
}

function getPaletteTotals(colors: RgbColor[], palette: RgbColor[]) {
  const totals = palette.map(createEmptyColorTotals);

  for (const color of colors) {
    const paletteIndex = findClosestPaletteIndex(color, palette);
    addColorToTotal(totals[paletteIndex], color);
  }

  return totals;
}

function getAveragePaletteColor(color: RgbColor, total: ColorTotals) {
  if (total.count === 0) {
    return color;
  }

  return {
    r: Math.round(total.r / total.count),
    g: Math.round(total.g / total.count),
    b: Math.round(total.b / total.count),
  };
}

function refinePalette(colors: RgbColor[], palette: RgbColor[], iterationCount = 8): RgbColor[] {
  let nextPalette = palette;

  for (let iteration = 0; iteration < iterationCount; iteration += 1) {
    const totals = getPaletteTotals(colors, nextPalette);
    nextPalette = nextPalette.map((color, index) => getAveragePaletteColor(color, totals[index]));
  }

  return nextPalette;
}

function readRgbColor(data: Uint8ClampedArray, index: number): RgbColor {
  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2],
  };
}

function writeRgbColor(data: Uint8ClampedArray, index: number, color: RgbColor) {
  data[index] = color.r;
  data[index + 1] = color.g;
  data[index + 2] = color.b;
  data[index + 3] = 255;
}

function applyPaletteToImageData(data: Uint8ClampedArray, palette: RgbColor[]) {
  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] === 0) {
      continue;
    }

    const paletteColor = palette[findClosestPaletteIndex(readRgbColor(data, index), palette)];
    writeRgbColor(data, index, paletteColor);
  }
}

function quantizeImageData(imageData: ImageData, colorCount: number) {
  const data = imageData.data;
  const { hasTransparentPixels, opaqueColors } = getImageColorBuckets(data);
  const opaqueColorCount = getOpaqueColorCount(colorCount, hasTransparentPixels);

  if (opaqueColors.length === 0 || opaqueColorCount === 0) {
    clearImageData(data);
    return imageData;
  }

  const palette = refinePalette(opaqueColors, getInitialPalette(opaqueColors, opaqueColorCount));
  applyPaletteToImageData(data, palette);

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
