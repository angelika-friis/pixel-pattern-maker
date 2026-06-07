import { clamp } from '../../domain/pixelGrid';
import type { RgbColor } from './colorValues';

const ORIGINAL_SATURATION_PERCENT = 100;
const RGB_MAX = 255;
const GAMUT_FIT_ITERATIONS = 14;

type OklabColor = {
  l: number;
  a: number;
  b: number;
};

function srgbToLinear(value: number) {
  const normalizedValue = value / RGB_MAX;

  return normalizedValue <= 0.04045
    ? normalizedValue / 12.92
    : ((normalizedValue + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(value: number) {
  const normalizedValue = value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055;

  return normalizedValue * RGB_MAX;
}

function rgbToOklab(red: number, green: number, blue: number): OklabColor {
  const linearRed = srgbToLinear(red);
  const linearGreen = srgbToLinear(green);
  const linearBlue = srgbToLinear(blue);

  const l = Math.cbrt(
    0.4122214708 * linearRed + 0.5363325363 * linearGreen + 0.0514459929 * linearBlue,
  );
  const m = Math.cbrt(
    0.2119034982 * linearRed + 0.6806995451 * linearGreen + 0.1073969566 * linearBlue,
  );
  const s = Math.cbrt(
    0.0883024619 * linearRed + 0.2817188376 * linearGreen + 0.6299787005 * linearBlue,
  );

  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

function oklabToLinearRgb({ l, a, b }: OklabColor) {
  const lPrime = l + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = l - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = l - 0.0894841775 * a - 1.291485548 * b;
  const lCubed = lPrime ** 3;
  const mCubed = mPrime ** 3;
  const sCubed = sPrime ** 3;

  return {
    r: 4.0767416621 * lCubed - 3.3077115913 * mCubed + 0.2309699292 * sCubed,
    g: -1.2684380046 * lCubed + 2.6097574011 * mCubed - 0.3413193965 * sCubed,
    b: -0.0041960863 * lCubed - 0.7034186147 * mCubed + 1.707614701 * sCubed,
  };
}

function isInSrgbGamut(color: RgbColor) {
  return (
    color.r >= 0 &&
    color.r <= RGB_MAX &&
    color.g >= 0 &&
    color.g <= RGB_MAX &&
    color.b >= 0 &&
    color.b <= RGB_MAX
  );
}

function oklabToRgb(color: OklabColor): RgbColor {
  const linearRgb = oklabToLinearRgb(color);

  return {
    r: linearToSrgb(linearRgb.r),
    g: linearToSrgb(linearRgb.g),
    b: linearToSrgb(linearRgb.b),
  };
}

function clampRgbColor(color: RgbColor): RgbColor {
  return {
    r: Math.round(clamp(color.r, 0, RGB_MAX)),
    g: Math.round(clamp(color.g, 0, RGB_MAX)),
    b: Math.round(clamp(color.b, 0, RGB_MAX)),
  };
}

function fitOklabChromaToSrgbGamut(color: OklabColor): OklabColor {
  if (isInSrgbGamut(oklabToRgb(color))) {
    return color;
  }

  let low = 0;
  let high = 1;
  let fittedColor = { ...color, a: 0, b: 0 };

  for (let iteration = 0; iteration < GAMUT_FIT_ITERATIONS; iteration += 1) {
    const scale = (low + high) / 2;
    const candidate = {
      ...color,
      a: color.a * scale,
      b: color.b * scale,
    };

    if (isInSrgbGamut(oklabToRgb(candidate))) {
      low = scale;
      fittedColor = candidate;
    } else {
      high = scale;
    }
  }

  return fittedColor;
}

function adjustRgbColorSaturation(
  red: number,
  green: number,
  blue: number,
  saturationFactor: number,
) {
  const oklabColor = rgbToOklab(red, green, blue);
  const adjustedColor = fitOklabChromaToSrgbGamut({
    ...oklabColor,
    a: oklabColor.a * saturationFactor,
    b: oklabColor.b * saturationFactor,
  });

  return clampRgbColor(oklabToRgb(adjustedColor));
}

export function adjustImageDataSaturation(imageData: ImageData, saturationPercent: number) {
  if (saturationPercent === ORIGINAL_SATURATION_PERCENT) {
    return imageData;
  }

  const saturationFactor = saturationPercent / ORIGINAL_SATURATION_PERCENT;
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] === 0) {
      continue;
    }

    const adjustedColor = adjustRgbColorSaturation(
      data[index],
      data[index + 1],
      data[index + 2],
      saturationFactor,
    );

    data[index] = adjustedColor.r;
    data[index + 1] = adjustedColor.g;
    data[index + 2] = adjustedColor.b;
  }

  return imageData;
}
