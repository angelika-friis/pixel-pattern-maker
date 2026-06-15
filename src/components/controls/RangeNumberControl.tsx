import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { clamp } from '../../domain/pixelGrid';
import styles from './RangeNumberControl.module.css';

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
    <div className={styles['control-group']}>
      <div className={styles['control-heading']}>
        <Icon aria-hidden="true" />
        <span className={styles['control-label']}>{label}</span>
        {isEditing ? (
          <input
            ref={inputRef}
            className={styles['heading-number-input']}
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
          <button
            className={styles['display-value-button']}
            type="button"
            onClick={() => setIsEditing(true)}
          >
            {displayValue}
          </button>
        )}
      </div>
      <input
        type="range"
        className={styles['range-input']}
        min={rangeMin}
        max={rangeMax}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
