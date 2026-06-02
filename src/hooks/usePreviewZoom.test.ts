{
  /**
  Verifies the public zoom state contract: default value, bounded updates,
  incremental zoom actions, and reset behavior.
*/
}

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PREVIEW_ZOOM,
  MAX_PREVIEW_ZOOM,
  MIN_PREVIEW_ZOOM,
  PREVIEW_ZOOM_STEP,
} from '../domain/pixelGrid';
import { usePreviewZoom } from './usePreviewZoom';

describe('usePreviewZoom', () => {
  it('starts at the default zoom level', () => {
    const { result } = renderHook(() => usePreviewZoom());

    expect(result.current.previewZoom).toBe(DEFAULT_PREVIEW_ZOOM);
  });

  it('sets zoom within the allowed range', () => {
    const { result } = renderHook(() => usePreviewZoom());

    act(() => {
      result.current.setPreviewZoom(DEFAULT_PREVIEW_ZOOM + PREVIEW_ZOOM_STEP);
    });

    expect(result.current.previewZoom).toBe(DEFAULT_PREVIEW_ZOOM + PREVIEW_ZOOM_STEP);
  });

  it('clamps direct zoom changes to the configured range', () => {
    const { result } = renderHook(() => usePreviewZoom());

    act(() => {
      result.current.setPreviewZoom(MAX_PREVIEW_ZOOM + PREVIEW_ZOOM_STEP);
    });

    expect(result.current.previewZoom).toBe(MAX_PREVIEW_ZOOM);

    act(() => {
      result.current.setPreviewZoom(MIN_PREVIEW_ZOOM - PREVIEW_ZOOM_STEP);
    });

    expect(result.current.previewZoom).toBe(MIN_PREVIEW_ZOOM);
  });

  it('zooms in and out by the configured step', () => {
    const { result } = renderHook(() => usePreviewZoom());

    act(() => {
      result.current.zoomIn();
    });

    expect(result.current.previewZoom).toBe(DEFAULT_PREVIEW_ZOOM + PREVIEW_ZOOM_STEP);

    act(() => {
      result.current.zoomOut();
    });

    expect(result.current.previewZoom).toBe(DEFAULT_PREVIEW_ZOOM);
  });

  it('does not zoom beyond the configured range', () => {
    const { result } = renderHook(() => usePreviewZoom());

    act(() => {
      result.current.setPreviewZoom(MAX_PREVIEW_ZOOM);
      result.current.zoomIn();
    });

    expect(result.current.previewZoom).toBe(MAX_PREVIEW_ZOOM);

    act(() => {
      result.current.setPreviewZoom(MIN_PREVIEW_ZOOM);
      result.current.zoomOut();
    });

    expect(result.current.previewZoom).toBe(MIN_PREVIEW_ZOOM);
  });

  it('resets zoom to the default value', () => {
    const { result } = renderHook(() => usePreviewZoom());

    act(() => {
      result.current.setPreviewZoom(MAX_PREVIEW_ZOOM);
      result.current.resetPreviewZoom();
    });

    expect(result.current.previewZoom).toBe(DEFAULT_PREVIEW_ZOOM);
  });
});
