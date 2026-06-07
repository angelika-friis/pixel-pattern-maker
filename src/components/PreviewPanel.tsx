import type { RefObject } from 'react';
import { ImageDown, ImagePlus } from 'lucide-react';
import type { PreviewInfo } from '../domain/pixelGrid';
import { PreviewZoomControls } from './preview/PreviewZoomControls';

type PreviewPanelProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  canDownloadPng: boolean;
  hasImage: boolean;
  onDownloadPng: () => void;
  onPreviewZoomChange: (value: number) => void;
  onPreviewZoomIn: () => void;
  onPreviewZoomOut: () => void;
  onPreviewZoomReset: () => void;
  previewInfo: PreviewInfo | null;
  previewRef: RefObject<HTMLElement | null>;
  previewZoom: number;
};

export function PreviewPanel({
  canvasRef,
  canDownloadPng,
  hasImage,
  onDownloadPng,
  onPreviewZoomChange,
  onPreviewZoomIn,
  onPreviewZoomOut,
  onPreviewZoomReset,
  previewInfo,
  previewRef,
  previewZoom,
}: PreviewPanelProps) {
  const canvasStyle = previewInfo
    ? {
        width: `${previewInfo.width}px`,
        height: `${previewInfo.height}px`,
      }
    : undefined;
  const previewScale = previewInfo ? previewInfo.scale : 1;

  return (
    <section ref={previewRef} className="preview" aria-label="Preview">
      {hasImage ? (
        <>
          <PreviewZoomControls
            zoom={previewZoom}
            onChange={onPreviewZoomChange}
            onReset={onPreviewZoomReset}
            onZoomIn={onPreviewZoomIn}
            onZoomOut={onPreviewZoomOut}
          />
          {canDownloadPng && (
            <button type="button" className="preview-download-button" onClick={onDownloadPng}>
              <ImageDown aria-hidden="true" />
              PNG
            </button>
          )}
          <div className="canvas-viewport">
            <div className="canvas-stack">
              <canvas ref={canvasRef} style={canvasStyle} />
              {previewInfo && previewScale !== 1 && (
                <span className="zoom-badge">{Math.round(previewScale * 100)}%</span>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="canvas-viewport">
          <div className="empty-state">
            <ImagePlus aria-hidden="true" />
            <p>Choose an image to create pixel art with a grid.</p>
          </div>
        </div>
      )}
    </section>
  );
}
