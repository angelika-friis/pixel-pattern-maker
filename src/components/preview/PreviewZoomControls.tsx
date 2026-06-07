import { Minus, Plus, RotateCcw, ZoomIn } from 'lucide-react';
import {
  DEFAULT_PREVIEW_ZOOM,
  MAX_PREVIEW_ZOOM,
  MIN_PREVIEW_ZOOM,
  PREVIEW_ZOOM_STEP,
} from '../../domain/pixelGrid';

type PreviewZoomControlsProps = {
  zoom: number;
  onChange: (value: number) => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export function PreviewZoomControls({
  zoom,
  onChange,
  onReset,
  onZoomIn,
  onZoomOut,
}: PreviewZoomControlsProps) {
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="preview-zoom-controls" aria-label="Zoom preview">
      <ZoomIn aria-hidden="true" />
      <button
        type="button"
        className="icon-button"
        onClick={onZoomOut}
        disabled={zoom <= MIN_PREVIEW_ZOOM}
        aria-label="Zoom out"
      >
        <Minus aria-hidden="true" />
      </button>
      <input
        type="range"
        min={MIN_PREVIEW_ZOOM}
        max={MAX_PREVIEW_ZOOM}
        step={PREVIEW_ZOOM_STEP}
        value={zoom}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Zoom level"
      />
      <button
        type="button"
        className="icon-button"
        onClick={onZoomIn}
        disabled={zoom >= MAX_PREVIEW_ZOOM}
        aria-label="Zoom in"
      >
        <Plus aria-hidden="true" />
      </button>
      <button
        type="button"
        className="icon-button"
        onClick={onReset}
        disabled={zoom === DEFAULT_PREVIEW_ZOOM}
        aria-label="Reset zoom"
      >
        <RotateCcw aria-hidden="true" />
      </button>
      <span className="preview-zoom-value">{zoomPercent}%</span>
    </div>
  );
}
