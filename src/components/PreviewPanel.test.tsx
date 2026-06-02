import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PreviewPanel } from './PreviewPanel';

const defaultProps = {
  canvasRef: createRef<HTMLCanvasElement>(),
  canDownloadPng: false,
  hasImage: false,
  onDownloadPng: vi.fn(),
  onPreviewZoomChange: vi.fn(),
  onPreviewZoomIn: vi.fn(),
  onPreviewZoomOut: vi.fn(),
  onPreviewZoomReset: vi.fn(),
  previewInfo: null,
  previewRef: createRef<HTMLElement>(),
  previewZoom: 1,
};

describe('PreviewPanel', () => {
  it('renders the empty state before an image has been uploaded', () => {
    render(<PreviewPanel {...defaultProps} />);

    expect(screen.getByLabelText(/förhandsvisning/i)).toBeInTheDocument();
    expect(screen.getByText(/välj en bild för att skapa pixel art med grid/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/zooma förhandsvisning/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /png/i })).not.toBeInTheDocument();
  });

  it('renders preview controls and PNG action when an image can be exported', () => {
    render(
      <PreviewPanel
        {...defaultProps}
        canDownloadPng
        hasImage
        previewInfo={{ width: 80, height: 60, cellSize: 10, scale: 1 }}
      />,
    );

    expect(screen.getByLabelText(/zooma förhandsvisning/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zoomnivå/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /png/i })).toBeInTheDocument();
  });
});
