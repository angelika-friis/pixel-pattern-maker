import { useEffect, useRef, useState } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const updateClampedValue = (nextValue: number) => {
    onChange(clamp(nextValue || inputMin, inputMin, inputMax));
  };

  return (
    <div className="control-group">
      <div className="control-heading">
        <Icon aria-hidden="true" />
        <span>{label}</span>
        {isEditing ? (
          <input
            ref={inputRef}
            className="heading-number-input"
            type="number"
            min={inputMin}
            max={inputMax}
            value={value}
            onBlur={() => setIsEditing(false)}
            onChange={(event) => updateClampedValue(Number(event.target.value))}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === 'Escape') {
                setIsEditing(false);
              }
            }}
            aria-label={inputLabel}
          />
        ) : (
          <button className="display-value-button" type="button" onClick={() => setIsEditing(true)}>
            {displayValue}
          </button>
        )}
      </div>
      <input
        type="range"
        min={rangeMin}
        max={rangeMax}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
