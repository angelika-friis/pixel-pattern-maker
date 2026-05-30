import type { PixelColor } from '../../domain/pixelGrid';
import { getSwatchStyle } from './getSwatchStyle';

type PaletteColorItemProps = {
  color: PixelColor;
  isSelected: boolean;
  onSelect: (hex: string) => void;
};

export function PaletteColorItem({ color, isSelected, onSelect }: PaletteColorItemProps) {
  return (
    <button
      className="palette-item"
      type="button"
      title={`${color.hex} (${color.count})`}
      aria-pressed={isSelected}
      onClick={() => onSelect(color.hex)}
    >
      <span className="swatch" style={getSwatchStyle(color.hex)} />
      <span>{color.hex}</span>
      <strong>{color.count}</strong>
    </button>
  );
}
