import type { ChangeEvent, DragEvent, RefObject } from 'react';
import { Palette, SlidersHorizontal } from 'lucide-react';
import { MAX_COLOR_COUNT, MIN_COLOR_COUNT } from '../domain/pixelGrid';
import type { OutputInfo } from '../domain/pixelGrid';
import { ControlActions } from './controls/ControlActions';
import { GridControls } from './controls/GridControls';
import { ImageDropZone } from './controls/ImageDropZone';
import { OutputStats } from './controls/OutputStats';
import { RangeNumberControl } from './controls/RangeNumberControl';

type ControlPanelProps = {
  fileName: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  colorCount: number;
  gridColor: string;
  hasImage: boolean;
  outputInfo: OutputInfo | null;
  pixelSize: number;
  showGrid: boolean;
  onDownload: () => void;
  onColorCountChange: (value: number) => void;
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
  colorCount,
  gridColor,
  hasImage,
  outputInfo,
  pixelSize,
  showGrid,
  onDownload,
  onColorCountChange,
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

      <ImageDropZone
        fileName={fileName}
        fileInputRef={fileInputRef}
        onFileChange={onFileChange}
        onFileDrop={onFileDrop}
      />

      <RangeNumberControl
        Icon={SlidersHorizontal}
        label="Pixelstorlek"
        value={pixelSize}
        displayValue={`${pixelSize}px`}
        rangeMin={4}
        rangeMax={64}
        inputMin={2}
        inputMax={128}
        inputLabel="Pixelstorlek i pixlar"
        onChange={onPixelSizeChange}
      />

      <RangeNumberControl
        Icon={Palette}
        label="Antal färger"
        value={colorCount}
        displayValue={String(colorCount)}
        rangeMin={MIN_COLOR_COUNT}
        rangeMax={MAX_COLOR_COUNT}
        inputMin={MIN_COLOR_COUNT}
        inputMax={MAX_COLOR_COUNT}
        inputLabel="Antal färger i bilden"
        onChange={onColorCountChange}
      />

      <GridControls
        gridColor={gridColor}
        showGrid={showGrid}
        onGridColorChange={onGridColorChange}
        onShowGridChange={onShowGridChange}
      />

      <ControlActions canDownload={hasImage} onDownload={onDownload} onReset={onReset} />

      {outputInfo && <OutputStats outputInfo={outputInfo} />}
    </aside>
  );
}
