import { ChevronDown, Palette } from 'lucide-react';
import type { PixelColor } from '../../domain/pixelGrid';
import { PalettePreview } from './PalettePreview';

type PaletteToggleButtonProps = {
  colorCount: number;
  contentId: string;
  isOpen: boolean;
  previewColors: PixelColor[];
  onToggle: () => void;
};

export function PaletteToggleButton({
  colorCount,
  contentId,
  isOpen,
  previewColors,
  onToggle,
}: PaletteToggleButtonProps) {
  return (
    <button
      className="palette-button secondary"
      type="button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      onClick={onToggle}
    >
      <span className="palette-button-label">
        <Palette aria-hidden="true" />
        <span>Colors</span>
        <strong>{colorCount}</strong>
      </span>

      <PalettePreview colors={previewColors} />

      <ChevronDown className="palette-button-chevron" aria-hidden="true" />
    </button>
  );
}
