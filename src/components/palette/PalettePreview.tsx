import type { PixelColor } from '../../domain/pixelGrid';
import { getSwatchStyle } from './getSwatchStyle';

type PalettePreviewProps = {
  colors: PixelColor[];
};

export function PalettePreview({ colors }: PalettePreviewProps) {
  return (
    <span className="palette-preview" aria-hidden="true">
      {colors.map((color) => (
        <span
          className="palette-preview-swatch swatch"
          key={color.hex}
          style={getSwatchStyle(color.hex)}
        />
      ))}
    </span>
  );
}
