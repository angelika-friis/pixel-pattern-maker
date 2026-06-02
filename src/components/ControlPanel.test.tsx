import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ControlPanel } from './ControlPanel';

const defaultProps = {
  fileName: '',
  fileInputRef: createRef<HTMLInputElement>(),
  colorCount: 12,
  gridColor: '#111111',
  hasImage: false,
  outputInfo: null,
  pixelSize: 16,
  showGrid: true,
  onDownload: vi.fn(),
  onColorCountChange: vi.fn(),
  onFileChange: vi.fn(),
  onFileDrop: vi.fn(),
  onGridColorChange: vi.fn(),
  onPixelSizeChange: vi.fn(),
  onReset: vi.fn(),
  onShowGridChange: vi.fn(),
};

describe('ControlPanel', () => {
  it('renders upload and grid controls before an image has been uploaded', () => {
    render(<ControlPanel {...defaultProps} />);

    expect(screen.getByLabelText(/inställningar/i)).toBeInTheDocument();
    expect(screen.getByText(/ladda upp eller dra in en bild/i)).toBeInTheDocument();
    expect(screen.getByText(/pixelstorlek/i)).toBeInTheDocument();
    expect(screen.getByText(/antal färger/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gridfärg/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pdf/i })).toBeDisabled();
    expect(screen.queryByText(/^grid$/i)).not.toBeInTheDocument();
  });

  it('renders file-dependent actions and output stats when an image exists', () => {
    render(
      <ControlPanel
        {...defaultProps}
        fileName="bild.png"
        hasImage
        outputInfo={{ cols: 8, rows: 6, width: 128, height: 96 }}
      />,
    );

    expect(screen.getByText('bild.png')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pdf/i })).toBeEnabled();
    expect(screen.getByText('8 x 6')).toBeInTheDocument();
    expect(screen.getByText('128 x 96px')).toBeInTheDocument();
  });
});
