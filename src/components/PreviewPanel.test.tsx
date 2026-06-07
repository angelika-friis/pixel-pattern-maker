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

    expect(screen.getByLabelText(/preview/i)).toBeInTheDocument();
    expect(
      screen.getByText(/choose an image to create pixel art with a grid/i),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/zoom preview/i)).not.toBeInTheDocument();
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

    expect(screen.getByLabelText(/zoom preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zoom level/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /png/i })).toBeInTheDocument();
  });
});
