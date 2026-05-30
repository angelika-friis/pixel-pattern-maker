import type { RefObject } from 'react';
import { ImageDown, ImagePlus } from 'lucide-react';
import type { PreviewInfo } from '../domain/pixelGrid';

type PreviewPanelProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  canDownloadPng: boolean;
  hasImage: boolean;
  onDownloadPng: () => void;
  previewInfo: PreviewInfo | null;
  previewRef: RefObject<HTMLElement | null>;
};

export function PreviewPanel({
  canvasRef,
  canDownloadPng,
  hasImage,
  onDownloadPng,
  previewInfo,
  previewRef,
}: PreviewPanelProps) {
  return (
    <section ref={previewRef} className="preview" aria-label="Förhandsvisning">
      {hasImage ? (
        <>
          {canDownloadPng && (
            <button type="button" className="preview-download-button" onClick={onDownloadPng}>
              <ImageDown aria-hidden="true" />
              PNG
            </button>
          )}
          <div className="canvas-stack">
            <canvas ref={canvasRef} />
            {previewInfo && previewInfo.scale < 1 && (
              <span className="zoom-badge">{Math.round(previewInfo.scale * 100)}%</span>
            )}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <ImagePlus aria-hidden="true" />
          <p>Välj en bild för att skapa pixel art med grid.</p>
        </div>
      )}
    </section>
  );
}
