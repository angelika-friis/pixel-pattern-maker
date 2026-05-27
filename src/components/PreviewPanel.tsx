import type { RefObject } from 'react';
import { ImagePlus } from 'lucide-react';
import type { PreviewInfo } from '../domain/pixelGrid';

type PreviewPanelProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  hasImage: boolean;
  previewInfo: PreviewInfo | null;
  previewRef: RefObject<HTMLElement | null>;
};

export function PreviewPanel({ canvasRef, hasImage, previewInfo, previewRef }: PreviewPanelProps) {
  return (
    <section ref={previewRef} className="preview" aria-label="Förhandsvisning">
      {hasImage ? (
        <div className="canvas-stack">
          <canvas ref={canvasRef} />
          {previewInfo && previewInfo.scale < 1 && (
            <span className="zoom-badge">{Math.round(previewInfo.scale * 100)}%</span>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <ImagePlus aria-hidden="true" />
          <p>Välj en bild för att skapa pixel art med grid.</p>
        </div>
      )}
    </section>
  );
}
