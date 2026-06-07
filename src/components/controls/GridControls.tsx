import { Grid3X3 } from 'lucide-react';

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
    <div className="control-row">
      <label className="switch">
        <input
          type="checkbox"
          checked={showGrid}
          onChange={(event) => onShowGridChange(event.target.checked)}
        />
        <span>Show grid</span>
      </label>

      <label className="color-control" title="Grid color">
        <Grid3X3 aria-hidden="true" />
        <input
          type="color"
          value={gridColor}
          onChange={(event) => onGridColorChange(event.target.value)}
          aria-label="Grid color"
        />
      </label>
    </div>
  );
}
