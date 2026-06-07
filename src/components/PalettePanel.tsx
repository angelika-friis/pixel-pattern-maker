import type { PixelColor } from '../domain/pixelGrid';
import { PaletteColorGrid } from './palette/PaletteColorGrid';
import { PaletteToggleButton } from './palette/PaletteToggleButton';

type PalettePanelProps = {
  isOpen: boolean;
  pixelColors: PixelColor[];
  selectedColorHexes: string[];
  onOpenChange: (value: boolean) => void;
  onColorSelect: (hex: string) => void;
};

const PALETTE_PREVIEW_LIMIT = 8;
const PALETTE_CONTENT_ID = 'palette-colors';

export function PalettePanel({
  isOpen,
  pixelColors,
  selectedColorHexes,
  onOpenChange,
  onColorSelect,
}: PalettePanelProps) {
  const previewColors = pixelColors.slice(0, PALETTE_PREVIEW_LIMIT);
  const selectedColorHexSet = new Set(selectedColorHexes);

  return (
    <section className="palette-panel" aria-label="Image colors">
      <PaletteToggleButton
        colorCount={pixelColors.length}
        contentId={PALETTE_CONTENT_ID}
        isOpen={isOpen}
        previewColors={previewColors}
        onToggle={() => onOpenChange(!isOpen)}
      />

      <div
        className="palette-content"
        id={PALETTE_CONTENT_ID}
        aria-hidden={!isOpen}
        data-open={isOpen}
      >
        <PaletteColorGrid
          colors={pixelColors}
          selectedColorHexSet={selectedColorHexSet}
          onColorSelect={onColorSelect}
        />
      </div>
    </section>
  );
}
