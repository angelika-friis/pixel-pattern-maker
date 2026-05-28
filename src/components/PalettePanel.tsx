import type { PixelColor } from '../domain/pixelGrid';

type PalettePanelProps = {
  pixelColors: PixelColor[];
};

export function PalettePanel({ pixelColors }: PalettePanelProps) {
  return (
    <section className="palette-panel" aria-label="Färger i bilden">
      <div className="palette-heading">
        <span>Färger</span>
        <strong>{pixelColors.length}</strong>
      </div>
      <div className="palette-grid">
        {pixelColors.map((color) => (
          <div className="palette-item" key={color.hex} title={`${color.hex} (${color.count})`}>
            <span
              className="swatch"
              style={{
                backgroundColor: color.hex === 'transparent' ? 'transparent' : color.hex,
                backgroundImage: color.hex === 'transparent' ? undefined : 'none',
              }}
            />
            <span>{color.hex}</span>
            <strong>{color.count}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
