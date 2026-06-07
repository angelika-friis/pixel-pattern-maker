import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the initial workspace before an image has been uploaded', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /turn you image into a pattern/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/upload or drag in an image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preview/i)).toBeInTheDocument();
    expect(
      screen.getByText(/choose an image to create pixel art with a grid/i),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/image colors/i)).not.toBeInTheDocument();
  });
});
