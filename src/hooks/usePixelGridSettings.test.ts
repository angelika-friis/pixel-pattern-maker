{
  /**
  Verifies the public grid settings contract: default values, setting updates,
  selected color management, and workflow reset behavior.
*/
}

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_COLOR_COUNT,
  DEFAULT_COLOR_SATURATION,
  DEFAULT_IMAGE_CONTRAST,
  DEFAULT_PIXEL_SIZE,
} from '../domain/pixelGrid';
import { usePixelGridSettings } from './usePixelGridSettings';

describe('usePixelGridSettings', () => {
  it('starts with the default grid settings', () => {
    const { result } = renderHook(() => usePixelGridSettings());

    expect(result.current.pixelSize).toBe(DEFAULT_PIXEL_SIZE);
    expect(result.current.colorCount).toBe(DEFAULT_COLOR_COUNT);
    expect(result.current.colorSaturation).toBe(DEFAULT_COLOR_SATURATION);
    expect(result.current.imageContrast).toBe(DEFAULT_IMAGE_CONTRAST);
    expect(result.current.showGrid).toBe(true);
    expect(result.current.showColors).toBe(false);
    expect(result.current.gridColor).toBe('#424957');
    expect(result.current.selectedColorHexes).toEqual([]);
  });

  it('updates basic grid settings', () => {
    const { result } = renderHook(() => usePixelGridSettings());

    act(() => {
      result.current.setPixelSize(24);
      result.current.setColorCount(8);
      result.current.setColorSaturation(140);
      result.current.setImageContrast(130);
      result.current.setShowGrid(false);
      result.current.setShowColors(true);
      result.current.setGridColor('#ffffff');
    });

    expect(result.current.pixelSize).toBe(24);
    expect(result.current.colorCount).toBe(8);
    expect(result.current.colorSaturation).toBe(140);
    expect(result.current.imageContrast).toBe(130);
    expect(result.current.showGrid).toBe(false);
    expect(result.current.showColors).toBe(true);
    expect(result.current.gridColor).toBe('#ffffff');
  });

  it('adds and removes selected colors by hex value', () => {
    const { result } = renderHook(() => usePixelGridSettings());

    act(() => {
      result.current.toggleSelectedColorHex('#111111');
      result.current.toggleSelectedColorHex('#eeeeee');
    });

    expect(result.current.selectedColorHexes).toEqual(['#111111', '#eeeeee']);

    act(() => {
      result.current.toggleSelectedColorHex('#111111');
    });

    expect(result.current.selectedColorHexes).toEqual(['#eeeeee']);
  });

  it('supports replacing the selected color list directly', () => {
    const { result } = renderHook(() => usePixelGridSettings());

    act(() => {
      result.current.setSelectedColorHexes(['#111111', '#222222']);
    });

    expect(result.current.selectedColorHexes).toEqual(['#111111', '#222222']);
  });

  it('resets settings that belong to the generated grid workflow', () => {
    const { result } = renderHook(() => usePixelGridSettings());

    act(() => {
      result.current.setPixelSize(24);
      result.current.setColorCount(8);
      result.current.setColorSaturation(40);
      result.current.setImageContrast(160);
      result.current.setShowGrid(false);
      result.current.setShowColors(true);
      result.current.setGridColor('#ffffff');
      result.current.setSelectedColorHexes(['#111111']);
      result.current.resetSettings();
    });

    expect(result.current.pixelSize).toBe(DEFAULT_PIXEL_SIZE);
    expect(result.current.colorCount).toBe(DEFAULT_COLOR_COUNT);
    expect(result.current.colorSaturation).toBe(DEFAULT_COLOR_SATURATION);
    expect(result.current.imageContrast).toBe(DEFAULT_IMAGE_CONTRAST);
    expect(result.current.showGrid).toBe(true);
    expect(result.current.showColors).toBe(false);
    expect(result.current.gridColor).toBe('#ffffff');
    expect(result.current.selectedColorHexes).toEqual([]);
  });
});
