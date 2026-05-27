import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { ControlPanel } from '../components/ControlPanel';
import { PreviewPanel } from '../components/PreviewPanel';
import { DEFAULT_PIXEL_SIZE, getOutputInfo, getPreviewInfo } from '../domain/pixelGrid';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { drawPixelArt } from '../infrastructure/canvas/drawPixelArt';

export function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState('');
  const [pixelSize, setPixelSize] = useState(DEFAULT_PIXEL_SIZE);
  const [showGrid, setShowGrid] = useState(true);
  const [gridColor, setGridColor] = useState('#111827');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewRef = useRef<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewBounds = useResizeObserver(previewRef);

  const outputInfo = useMemo(() => {
    if (!image) {
      return null;
    }

    return getOutputInfo(image, pixelSize);
  }, [image, pixelSize]);

  const previewInfo = useMemo(() => {
    if (!outputInfo) {
      return null;
    }

    return getPreviewInfo(outputInfo, pixelSize, previewBounds);
  }, [outputInfo, pixelSize, previewBounds]);

  const renderPixelArt = useCallback(
    (cellSize = pixelSize, targetCanvas = canvasRef.current) => {
      if (!targetCanvas || !image || !outputInfo) {
        return;
      }

      drawPixelArt({
        canvas: targetCanvas,
        image,
        outputInfo,
        cellSize,
        showGrid,
        gridColor,
      });
    },
    [gridColor, image, outputInfo, pixelSize, showGrid],
  );

  useEffect(() => {
    if (previewInfo) {
      renderPixelArt(previewInfo.cellSize);
    }
  }, [previewInfo, renderPixelArt]);

  const loadFile = useCallback((file?: File) => {
    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    const url = URL.createObjectURL(file);
    const nextImage = new Image();
    nextImage.onload = () => {
      setImage(nextImage);
      setFileName(file.name);
      URL.revokeObjectURL(url);
    };
    nextImage.src = url;
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    loadFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    loadFile(event.dataTransfer.files?.[0]);
  };

  const downloadImage = () => {
    if (!image || !outputInfo) {
      return;
    }

    const exportCanvas = document.createElement('canvas');
    renderPixelArt(pixelSize, exportCanvas);

    const link = document.createElement('a');
    const baseName = fileName.replace(/\.[^.]+$/, '') || 'pixel-grid';
    link.download = `${baseName}-pixel-grid.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();

    if (previewInfo) {
      renderPixelArt(previewInfo.cellSize);
    }
  };

  const reset = () => {
    setImage(null);
    setFileName('');
    setPixelSize(DEFAULT_PIXEL_SIZE);
    setShowGrid(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="app-shell">
      <section className="workspace">
        <ControlPanel
          fileName={fileName}
          fileInputRef={fileInputRef}
          gridColor={gridColor}
          hasImage={Boolean(image)}
          outputInfo={outputInfo}
          pixelSize={pixelSize}
          showGrid={showGrid}
          onDownload={downloadImage}
          onFileChange={handleFileChange}
          onFileDrop={handleDrop}
          onGridColorChange={setGridColor}
          onPixelSizeChange={setPixelSize}
          onReset={reset}
          onShowGridChange={setShowGrid}
        />
        <PreviewPanel
          canvasRef={canvasRef}
          hasImage={Boolean(image)}
          previewInfo={previewInfo}
          previewRef={previewRef}
        />
      </section>
    </main>
  );
}
