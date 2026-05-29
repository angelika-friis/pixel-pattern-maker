import { ChevronDown, Palette } from 'lucide-react';
import type { PixelColor } from '../domain/pixelGrid';

type PalettePanelProps = {
  isOpen: boolean;
  pixelColors: PixelColor[];
  selectedColorHexes: string[];
  onOpenChange: (value: boolean) => void;
  onColorSelect: (hex: string) => void;
};

const PALETTE_PREVIEW_LIMIT = 8;

function getSwatchStyle(hex: string) {
  return {
    backgroundColor: hex === 'transparent' ? 'transparent' : hex,
    backgroundImage: hex === 'transparent' ? undefined : 'none',
  };
}

export function PalettePanel({
  isOpen,
  pixelColors,
  selectedColorHexes,
  onOpenChange,
  onColorSelect,
}: PalettePanelProps) {
  const previewColors = pixelColors.slice(0, PALETTE_PREVIEW_LIMIT);
  const paletteContentId = 'palette-colors';

  return (
    <section className="palette-panel" aria-label="Färger i bilden">
      <button
        className="palette-button secondary"
        type="button"
        aria-expanded={isOpen}
        aria-controls={paletteContentId}
        onClick={() => onOpenChange(!isOpen)}
      >
        <span className="palette-button-label">
          <Palette aria-hidden="true" />
          <span>Färger</span>
          <strong>{pixelColors.length}</strong>
        </span>

        <span className="palette-preview" aria-hidden="true">
          {previewColors.map((color) => (
            <span
              className="palette-preview-swatch swatch"
              key={color.hex}
              style={getSwatchStyle(color.hex)}
            />
          ))}
        </span>

        <ChevronDown className="palette-button-chevron" aria-hidden="true" />
      </button>

      <div
        className="palette-content"
        id={paletteContentId}
        aria-hidden={!isOpen}
        data-open={isOpen}
      >
        <div className="palette-grid">
          {pixelColors.map((color) => (
            <button
              className="palette-item"
              key={color.hex}
              type="button"
              title={`${color.hex} (${color.count})`}
              aria-pressed={selectedColorHexes.includes(color.hex)}
              onClick={() => onColorSelect(color.hex)}
            >
              <span className="swatch" style={getSwatchStyle(color.hex)} />
              <span>{color.hex}</span>
              <strong>{color.count}</strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
