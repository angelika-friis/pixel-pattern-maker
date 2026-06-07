import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PalettePanel } from './PalettePanel';

const colors = [
  { hex: '#111111', count: 10 },
  { hex: '#eeeeee', count: 5 },
];

describe('PalettePanel', () => {
  it('renders the uploaded image palette when mounted', () => {
    render(
      <PalettePanel
        isOpen
        pixelColors={colors}
        selectedColorHexes={['#111111']}
        onColorSelect={vi.fn()}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/image colors/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /colors2/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: /#11111110/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: /#eeeeee5/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
