import type { PixelColor } from '../../domain/pixelGrid';
import { PaletteColorItem } from './PaletteColorItem';

type PaletteColorGridProps = {
  colors: PixelColor[];
  selectedColorHexSet: Set<string>;
  onColorSelect: (hex: string) => void;
};

export function PaletteColorGrid({
  colors,
  selectedColorHexSet,
  onColorSelect,
}: PaletteColorGridProps) {
  return (
    <div className="palette-grid">
      {colors.map((color) => (
        <PaletteColorItem
          color={color}
          isSelected={selectedColorHexSet.has(color.hex)}
          key={color.hex}
          onSelect={onColorSelect}
        />
      ))}
    </div>
  );
}
