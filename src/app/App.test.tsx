import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the initial workspace before an image has been uploaded', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /gör bilder till pixel art/i })).toBeInTheDocument();
    expect(screen.getByText(/ladda upp eller dra in en bild/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/förhandsvisning/i)).toBeInTheDocument();
    expect(screen.getByText(/välj en bild för att skapa pixel art med grid/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/färger i bilden/i)).not.toBeInTheDocument();
  });
});
