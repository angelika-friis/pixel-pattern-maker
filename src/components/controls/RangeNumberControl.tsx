import type { LucideIcon } from 'lucide-react';
import { clamp } from '../../domain/pixelGrid';

type RangeNumberControlProps = {
  Icon: LucideIcon;
  label: string;
  value: number;
  displayValue: string;
  rangeMin: number;
  rangeMax: number;
  inputMin: number;
  inputMax: number;
  inputLabel: string;
  onChange: (value: number) => void;
};

export function RangeNumberControl({
  Icon,
  label,
  value,
  displayValue,
  rangeMin,
  rangeMax,
  inputMin,
  inputMax,
  inputLabel,
  onChange,
}: RangeNumberControlProps) {
  const updateClampedValue = (nextValue: number) => {
    onChange(clamp(nextValue || inputMin, inputMin, inputMax));
  };

  return (
    <div className="control-group">
      <div className="control-heading">
        <Icon aria-hidden="true" />
        <span>{label}</span>
        <strong>{displayValue}</strong>
      </div>
      <input
        type="range"
        min={rangeMin}
        max={rangeMax}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <input
        className="number-input"
        type="number"
        min={inputMin}
        max={inputMax}
        value={value}
        onChange={(event) => updateClampedValue(Number(event.target.value))}
        aria-label={inputLabel}
      />
    </div>
  );
}
