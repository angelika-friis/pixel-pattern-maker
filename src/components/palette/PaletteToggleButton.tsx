import { ChevronDown, Palette } from 'lucide-react';
import type { PixelColor } from '../../domain/pixelGrid';
import buttonStyles from '../../styles/shared/button.module.css';
import { PalettePreview } from './PalettePreview';
import styles from './PaletteToggleButton.module.css';

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
      className={`${buttonStyles.button} ${buttonStyles.secondary} ${styles['palette-button']}`}
      type="button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      onClick={onToggle}
    >
      <span className={styles['palette-button-label']}>
        <Palette aria-hidden="true" />
        <span>Colors</span>
        <strong>{colorCount}</strong>
      </span>

      <PalettePreview colors={previewColors} />

      <ChevronDown className={styles['palette-button-chevron']} aria-hidden="true" />
    </button>
  );
}
