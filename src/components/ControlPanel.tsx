import type { ChangeEvent, DragEvent, RefObject } from 'react';
import { Palette, SlidersHorizontal } from 'lucide-react';
import { MAX_COLOR_COUNT, MIN_COLOR_COUNT } from '../domain/pixelGrid';
import type { OutputInfo } from '../domain/pixelGrid';
import type { ThemeMode } from '../domain/theme';
import { ControlActions } from './controls/ControlActions';
import { GridControls } from './controls/GridControls';
import { ImageDropZone } from './controls/ImageDropZone';
import { ImageAdjustmentControls } from './controls/ImageAdjustmentControls';
import { OutputStats } from './controls/OutputStats';
import { RangeNumberControl } from './controls/RangeNumberControl';
import { ThemeToggleButton } from './controls/ThemeToggleButton';

type ControlPanelProps = {
  fileName: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  colorCount: number;
  colorSaturation: number;
  gridColor: string;
  hasImage: boolean;
  imageContrast: number;
  outputInfo: OutputInfo | null;
  pixelSize: number;
  showGrid: boolean;
  themeMode: ThemeMode;
  onDownload: () => void;
  onColorCountChange: (value: number) => void;
  onColorSaturationChange: (value: number) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFileDrop: (event: DragEvent<HTMLLabelElement>) => void;
  onGridColorChange: (value: string) => void;
  onImageContrastChange: (value: number) => void;
  onPixelSizeChange: (value: number) => void;
  onReset: () => void;
  onShowGridChange: (value: boolean) => void;
  onThemeToggle: () => void;
};

export function ControlPanel({
  fileName,
  fileInputRef,
  colorCount,
  colorSaturation,
  gridColor,
  hasImage,
  imageContrast,
  outputInfo,
  pixelSize,
  showGrid,
  themeMode,
  onDownload,
  onColorCountChange,
  onColorSaturationChange,
  onFileChange,
  onFileDrop,
  onGridColorChange,
  onImageContrastChange,
  onPixelSizeChange,
  onReset,
  onShowGridChange,
  onThemeToggle,
}: ControlPanelProps) {
  return (
    <aside className="controls" aria-label="Settings">
      <div className="controls-header">
        <div>
          <p className="eyebrow">Pixel Grid</p>
          <h1>Turn your image into a pattern</h1>
        </div>
        <ThemeToggleButton themeMode={themeMode} onToggle={onThemeToggle} />
      </div>

      <ImageDropZone
        fileName={fileName}
        fileInputRef={fileInputRef}
        onFileChange={onFileChange}
        onFileDrop={onFileDrop}
      />

      <RangeNumberControl
        Icon={SlidersHorizontal}
        label="Pixel size"
        value={pixelSize}
        displayValue={`${pixelSize}px`}
        rangeMin={4}
        rangeMax={64}
        inputMin={2}
        inputMax={128}
        inputLabel="Pixel size in pixels"
        onChange={onPixelSizeChange}
      />

      <RangeNumberControl
        Icon={Palette}
        label="Color count"
        value={colorCount}
        displayValue={String(colorCount)}
        rangeMin={MIN_COLOR_COUNT}
        rangeMax={MAX_COLOR_COUNT}
        inputMin={MIN_COLOR_COUNT}
        inputMax={MAX_COLOR_COUNT}
        inputLabel="Number of colors in the image"
        onChange={onColorCountChange}
      />

      <ImageAdjustmentControls
        colorSaturation={colorSaturation}
        imageContrast={imageContrast}
        onColorSaturationChange={onColorSaturationChange}
        onImageContrastChange={onImageContrastChange}
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
