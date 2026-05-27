import type { ChangeEvent, DragEvent, RefObject } from 'react';
import { Download, Grid3X3, ImagePlus, Palette, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { MAX_COLOR_COUNT, MIN_COLOR_COUNT, clamp } from '../domain/pixelGrid';
import type { OutputInfo } from '../domain/pixelGrid';
import type { PixelColor } from '../infrastructure/canvas/drawPixelArt';
import { PalettePanel } from './PalettePanel';

type ControlPanelProps = {
  fileName: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  colorCount: number;
  gridColor: string;
  hasImage: boolean;
  outputInfo: OutputInfo | null;
  pixelColors: PixelColor[];
  pixelSize: number;
  showColors: boolean;
  showGrid: boolean;
  onDownload: () => void;
  onColorCountChange: (value: number) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFileDrop: (event: DragEvent<HTMLLabelElement>) => void;
  onGridColorChange: (value: string) => void;
  onPixelSizeChange: (value: number) => void;
  onReset: () => void;
  onShowColorsChange: (value: boolean) => void;
  onShowGridChange: (value: boolean) => void;
};

export function ControlPanel({
  fileName,
  fileInputRef,
  colorCount,
  gridColor,
  hasImage,
  outputInfo,
  pixelColors,
  pixelSize,
  showColors,
  showGrid,
  onDownload,
  onColorCountChange,
  onFileChange,
  onFileDrop,
  onGridColorChange,
  onPixelSizeChange,
  onReset,
  onShowColorsChange,
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

      <div className="control-group">
        <div className="control-heading">
          <Palette aria-hidden="true" />
          <span>Antal färger</span>
          <strong>{colorCount}</strong>
        </div>
        <input
          type="range"
          min={MIN_COLOR_COUNT}
          max={MAX_COLOR_COUNT}
          value={colorCount}
          onChange={(event) => onColorCountChange(Number(event.target.value))}
        />
        <input
          className="number-input"
          type="number"
          min={MIN_COLOR_COUNT}
          max={MAX_COLOR_COUNT}
          value={colorCount}
          onChange={(event) =>
            onColorCountChange(
              clamp(
                Number(event.target.value) || MIN_COLOR_COUNT,
                MIN_COLOR_COUNT,
                MAX_COLOR_COUNT,
              ),
            )
          }
          aria-label="Antal färger i bilden"
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

      <label className="switch">
        <input
          type="checkbox"
          checked={showColors}
          disabled={!hasImage}
          onChange={(event) => onShowColorsChange(event.target.checked)}
        />
        <span>Visa alla färger</span>
      </label>

      {showColors && hasImage && <PalettePanel pixelColors={pixelColors} />}

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
