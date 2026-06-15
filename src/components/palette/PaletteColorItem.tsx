import type { PixelColor } from '../../domain/pixelGrid';
import { getSwatchStyle } from './getSwatchStyle';
import styles from './PaletteColorItem.module.css';
import swatchStyles from './Swatch.module.css';

type PaletteColorItemProps = {
  color: PixelColor;
  isSelected: boolean;
  onSelect: (hex: string) => void;
};

export function PaletteColorItem({ color, isSelected, onSelect }: PaletteColorItemProps) {
  return (
    <button
      className={styles['palette-item']}
      type="button"
      title={`${color.hex} (${color.count})`}
      aria-pressed={isSelected}
      onClick={() => onSelect(color.hex)}
    >
      <span className={swatchStyles.swatch} style={getSwatchStyle(color.hex)} />
      <span className={styles['palette-item-hex']}>{color.hex}</span>
      <strong className={styles['palette-item-count']}>{color.count}</strong>
    </button>
  );
}
