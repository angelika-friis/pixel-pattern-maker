import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { ControlPanel } from '../components/ControlPanel';
import { PreviewPanel } from '../components/PreviewPanel';
import {
  DEFAULT_COLOR_COUNT,
  DEFAULT_PIXEL_SIZE,
  getOutputInfo,
  getPreviewInfo,
} from '../domain/pixelGrid';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { createDownloadCanvas } from '../infrastructure/canvas/createDownloadCanvas';
import { drawPixelArt, getPixelColors } from '../infrastructure/canvas/drawPixelArt';

export function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState('');
  const [pixelSize, setPixelSize] = useState(DEFAULT_PIXEL_SIZE);
  const [colorCount, setColorCount] = useState(DEFAULT_COLOR_COUNT);
  const [showGrid, setShowGrid] = useState(true);
  const [showColors, setShowColors] = useState(false);
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

  const pixelColors = useMemo(() => {
    if (!image || !outputInfo) {
      return [];
    }

    return getPixelColors(image, outputInfo, colorCount);
  }, [colorCount, image, outputInfo]);

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
        colorCount,
        showGrid,
        gridColor,
      });
    },
    [colorCount, gridColor, image, outputInfo, pixelSize, showGrid],
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
    const downloadCanvas = createDownloadCanvas(exportCanvas, pixelColors);

    const link = document.createElement('a');
    const baseName = fileName.replace(/\.[^.]+$/, '') || 'pixel-grid';
    link.download = `${baseName}-pixel-grid.png`;
    link.href = downloadCanvas.toDataURL('image/png');
    link.click();

    if (previewInfo) {
      renderPixelArt(previewInfo.cellSize);
    }
  };

  const reset = () => {
    setImage(null);
    setFileName('');
    setPixelSize(DEFAULT_PIXEL_SIZE);
    setColorCount(DEFAULT_COLOR_COUNT);
    setShowGrid(true);
    setShowColors(false);
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
          colorCount={colorCount}
          gridColor={gridColor}
          hasImage={Boolean(image)}
          outputInfo={outputInfo}
          pixelColors={pixelColors}
          pixelSize={pixelSize}
          showColors={showColors}
          showGrid={showGrid}
          onDownload={downloadImage}
          onFileChange={handleFileChange}
          onFileDrop={handleDrop}
          onColorCountChange={setColorCount}
          onGridColorChange={setGridColor}
          onPixelSizeChange={setPixelSize}
          onReset={reset}
          onShowColorsChange={setShowColors}
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
