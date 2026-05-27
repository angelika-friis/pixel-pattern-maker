import type { ChangeEvent, DragEvent, RefObject } from 'react';
import { Download, Grid3X3, ImagePlus, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { clamp } from '../domain/pixelGrid';
import type { OutputInfo } from '../domain/pixelGrid';

type ControlPanelProps = {
  fileName: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  gridColor: string;
  hasImage: boolean;
  outputInfo: OutputInfo | null;
  pixelSize: number;
  showGrid: boolean;
  onDownload: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFileDrop: (event: DragEvent<HTMLLabelElement>) => void;
  onGridColorChange: (value: string) => void;
  onPixelSizeChange: (value: number) => void;
  onReset: () => void;
  onShowGridChange: (value: boolean) => void;
};

export function ControlPanel({
  fileName,
  fileInputRef,
  gridColor,
  hasImage,
  outputInfo,
  pixelSize,
  showGrid,
  onDownload,
  onFileChange,
  onFileDrop,
  onGridColorChange,
  onPixelSizeChange,
  onReset,
  onShowGridChange,
}: ControlPanelProps) {
  return (
    <aside className="controls" aria-label="Inställningar">
      <div>
        <p className="eyebrow">Pixel Grid</p>
        <h1>Gör bilder till pixel art</h1>
      </div>

      <label
        className="drop-zone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={onFileDrop}
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} />
        <ImagePlus aria-hidden="true" />
        <span>{fileName || 'Ladda upp eller dra in en bild'}</span>
      </label>

      <div className="control-group">
        <div className="control-heading">
          <SlidersHorizontal aria-hidden="true" />
          <span>Pixelstorlek</span>
          <strong>{pixelSize}px</strong>
        </div>
        <input
          type="range"
          min="4"
          max="64"
          value={pixelSize}
          onChange={(event) => onPixelSizeChange(Number(event.target.value))}
        />
        <input
          className="number-input"
          type="number"
          min="2"
          max="128"
          value={pixelSize}
          onChange={(event) => onPixelSizeChange(clamp(Number(event.target.value) || 2, 2, 128))}
          aria-label="Pixelstorlek i pixlar"
        />
      </div>

      <div className="control-row">
        <label className="switch">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(event) => onShowGridChange(event.target.checked)}
          />
          <span>Visa grid</span>
        </label>

        <label className="color-control" title="Gridfärg">
          <Grid3X3 aria-hidden="true" />
          <input
            type="color"
            value={gridColor}
            onChange={(event) => onGridColorChange(event.target.value)}
            aria-label="Gridfärg"
          />
        </label>
      </div>

      <div className="action-row">
        <button type="button" onClick={onDownload} disabled={!hasImage}>
          <Download aria-hidden="true" />
          PNG
        </button>
        <button type="button" className="secondary" onClick={onReset}>
          <RotateCcw aria-hidden="true" />
          Återställ
        </button>
      </div>

      {outputInfo && (
        <dl className="stats">
          <div>
            <dt>Grid</dt>
            <dd>
              {outputInfo.cols} x {outputInfo.rows}
            </dd>
          </div>
          <div>
            <dt>Bild</dt>
            <dd>
              {outputInfo.width} x {outputInfo.height}px
            </dd>
          </div>
        </dl>
      )}
    </aside>
  );
}
