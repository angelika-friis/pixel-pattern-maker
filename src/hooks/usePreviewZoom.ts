import { useCallback, useState } from 'react';
import {
  DEFAULT_PREVIEW_ZOOM,
  MAX_PREVIEW_ZOOM,
  MIN_PREVIEW_ZOOM,
  PREVIEW_ZOOM_STEP,
  clamp,
} from '../domain/pixelGrid';

export function usePreviewZoom() {
  const [previewZoom, setPreviewZoomState] = useState(DEFAULT_PREVIEW_ZOOM);

  const setPreviewZoom = useCallback((value: number) => {
    setPreviewZoomState(clamp(value, MIN_PREVIEW_ZOOM, MAX_PREVIEW_ZOOM));
  }, []);

  const zoomIn = useCallback(() => {
    setPreviewZoomState((currentZoom) =>
      clamp(currentZoom + PREVIEW_ZOOM_STEP, MIN_PREVIEW_ZOOM, MAX_PREVIEW_ZOOM),
    );
  }, []);

  const zoomOut = useCallback(() => {
    setPreviewZoomState((currentZoom) =>
      clamp(currentZoom - PREVIEW_ZOOM_STEP, MIN_PREVIEW_ZOOM, MAX_PREVIEW_ZOOM),
    );
  }, []);

  const resetPreviewZoom = useCallback(() => {
    setPreviewZoomState(DEFAULT_PREVIEW_ZOOM);
  }, []);

  return {
    previewZoom,
    resetPreviewZoom,
    setPreviewZoom,
    zoomIn,
    zoomOut,
  };
}
