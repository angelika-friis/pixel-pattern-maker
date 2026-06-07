import { useCallback, useState } from 'react';
import {
  DEFAULT_COLOR_COUNT,
  DEFAULT_COLOR_SATURATION,
  DEFAULT_IMAGE_CONTRAST,
  DEFAULT_PIXEL_SIZE,
} from '../domain/pixelGrid';

export function usePixelGridSettings() {
  const [pixelSize, setPixelSize] = useState(DEFAULT_PIXEL_SIZE);
  const [colorCount, setColorCount] = useState(DEFAULT_COLOR_COUNT);
  const [colorSaturation, setColorSaturation] = useState(DEFAULT_COLOR_SATURATION);
  const [imageContrast, setImageContrast] = useState(DEFAULT_IMAGE_CONTRAST);
  const [showGrid, setShowGrid] = useState(true);
  const [showColors, setShowColors] = useState(false);
  const [gridColor, setGridColor] = useState('#424957');
  const [selectedColorHexes, setSelectedColorHexes] = useState<string[]>([]);

  const toggleSelectedColorHex = useCallback((hex: string) => {
    setSelectedColorHexes((currentHexes) =>
      currentHexes.includes(hex)
        ? currentHexes.filter((currentHex) => currentHex !== hex)
        : [...currentHexes, hex],
    );
  }, []);

  const resetSettings = useCallback(() => {
    setPixelSize(DEFAULT_PIXEL_SIZE);
    setColorCount(DEFAULT_COLOR_COUNT);
    setColorSaturation(DEFAULT_COLOR_SATURATION);
    setImageContrast(DEFAULT_IMAGE_CONTRAST);
    setShowGrid(true);
    setShowColors(false);
    setSelectedColorHexes([]);
  }, []);

  return {
    colorCount,
    colorSaturation,
    gridColor,
    imageContrast,
    pixelSize,
    resetSettings,
    setColorCount,
    setColorSaturation,
    setGridColor,
    setImageContrast,
    setPixelSize,
    setSelectedColorHexes,
    setShowColors,
    setShowGrid,
    selectedColorHexes,
    showColors,
    showGrid,
    toggleSelectedColorHex,
  };
}
