import { Grid3X3 } from 'lucide-react';
import styles from './GridControls.module.css';

type GridControlsProps = {
  gridColor: string;
  showGrid: boolean;
  onGridColorChange: (value: string) => void;
  onShowGridChange: (value: boolean) => void;
};

export function GridControls({
  gridColor,
  showGrid,
  onGridColorChange,
  onShowGridChange,
}: GridControlsProps) {
  return (
    <div className={styles['control-row']}>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={showGrid}
          onChange={(event) => onShowGridChange(event.target.checked)}
        />
        <span>Show grid</span>
      </label>

      <label className={styles['color-control']} title="Grid color">
        <Grid3X3 aria-hidden="true" />
        <input
          className={styles['color-input']}
          type="color"
          value={gridColor}
          onChange={(event) => onGridColorChange(event.target.value)}
          aria-label="Grid color"
        />
      </label>
    </div>
  );
}
