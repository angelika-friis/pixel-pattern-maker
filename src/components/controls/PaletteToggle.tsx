type PaletteToggleProps = {
  disabled: boolean;
  showColors: boolean;
  onShowColorsChange: (value: boolean) => void;
};

export function PaletteToggle({ disabled, showColors, onShowColorsChange }: PaletteToggleProps) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={showColors}
        disabled={disabled}
        onChange={(event) => onShowColorsChange(event.target.checked)}
      />
      <span>Visa alla färger</span>
    </label>
  );
}
