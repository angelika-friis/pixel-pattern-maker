import type { PixelColor } from '../../domain/pixelGrid';
import { getSwatchStyle } from './getSwatchStyle';
import styles from './PalettePreview.module.css';
import swatchStyles from './Swatch.module.css';

type PalettePreviewProps = {
  colors: PixelColor[];
};

export function PalettePreview({ colors }: PalettePreviewProps) {
  return (
    <span className={styles['palette-preview']} aria-hidden="true">
      {colors.map((color) => (
        <span
          className={`${swatchStyles.swatch} ${styles['palette-preview-swatch']}`}
          key={color.hex}
          style={getSwatchStyle(color.hex)}
        />
      ))}
    </span>
  );
}
