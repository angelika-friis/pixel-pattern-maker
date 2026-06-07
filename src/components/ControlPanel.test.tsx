import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ControlPanel } from './ControlPanel';

const defaultProps = {
  fileName: '',
  fileInputRef: createRef<HTMLInputElement>(),
  colorCount: 12,
  colorSaturation: 100,
  gridColor: '#111111',
  hasImage: false,
  imageContrast: 100,
  outputInfo: null,
  pixelSize: 16,
  showGrid: true,
  themeMode: 'light' as const,
  onDownload: vi.fn(),
  onColorCountChange: vi.fn(),
  onColorSaturationChange: vi.fn(),
  onFileChange: vi.fn(),
  onFileDrop: vi.fn(),
  onGridColorChange: vi.fn(),
  onImageContrastChange: vi.fn(),
  onPixelSizeChange: vi.fn(),
  onReset: vi.fn(),
  onShowGridChange: vi.fn(),
  onThemeToggle: vi.fn(),
};

describe('ControlPanel', () => {
  it('renders upload and grid controls before an image has been uploaded', () => {
    render(<ControlPanel {...defaultProps} />);

    expect(screen.getByLabelText(/inställningar/i)).toBeInTheDocument();
    expect(screen.getByText(/ladda upp eller dra in en bild/i)).toBeInTheDocument();
    expect(screen.getByText(/pixelstorlek/i)).toBeInTheDocument();
    expect(screen.getByText(/antal färger/i)).toBeInTheDocument();
    expect(screen.getByText(/redigera bild/i)).toBeInTheDocument();
    expect(screen.queryByText(/färgmättnad/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/kontrast/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/gridfärg/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /byt till mörkt tema/i })).toBeInTheDocument();
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

  it('shows image adjustment controls behind the edit image toggle', async () => {
    const user = userEvent.setup();

    render(<ControlPanel {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: /redigera bild/i }));

    expect(screen.getByLabelText(/färgmättnad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kontrast/i)).toBeInTheDocument();
  });
});
