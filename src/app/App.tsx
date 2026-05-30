import { useEffect } from 'react';
import { ControlPanel } from '../components/ControlPanel';
import { PalettePanel } from '../components/PalettePanel';
import { PreviewPanel } from '../components/PreviewPanel';
import { useImageUpload } from '../hooks/useImageUpload';
import { usePixelArtPreview } from '../hooks/usePixelArtPreview';
import { usePixelGridSettings } from '../hooks/usePixelGridSettings';
import { downloadBlob } from '../services/downloadFile';
import { createPixelGridPdfBlob, getPixelGridPdfFileName } from '../services/exportPixelGridPdf';
import { createPixelGridPngBlob, getPixelGridPngFileName } from '../services/exportPixelGridPng';

export function App() {
  const { fileInputRef, fileName, handleDrop, handleFileChange, image, resetImage } =
    useImageUpload();
  const settings = usePixelGridSettings();
  const { selectedColorHexes, setSelectedColorHexes } = settings;
  const { canvasRef, outputInfo, pixelColors, previewInfo, previewRef } = usePixelArtPreview({
    image,
    pixelSize: settings.pixelSize,
    colorCount: settings.colorCount,
    showGrid: settings.showGrid,
    gridColor: settings.gridColor,
    selectedColorHexes,
  });

  useEffect(() => {
    const availableColorHexes = new Set(pixelColors.map((color) => color.hex));
    const availableSelections = selectedColorHexes.filter((hex) => availableColorHexes.has(hex));

    if (availableSelections.length !== selectedColorHexes.length) {
      setSelectedColorHexes(availableSelections);
    }
  }, [pixelColors, selectedColorHexes, setSelectedColorHexes]);

  const downloadPdf = () => {
    if (!image || !outputInfo) {
      return;
    }

    const pdfBlob = createPixelGridPdfBlob({
      image,
      outputInfo,
      pixelSize: settings.pixelSize,
      colorCount: settings.colorCount,
      showGrid: settings.showGrid,
      gridColor: settings.gridColor,
      pixelColors,
    });

    downloadBlob(pdfBlob, getPixelGridPdfFileName(fileName));
  };

  const downloadPng = async () => {
    if (!image || !outputInfo || selectedColorHexes.length === 0) {
      return;
    }

    const pngBlob = await createPixelGridPngBlob({
      image,
      outputInfo,
      pixelSize: settings.pixelSize,
      colorCount: settings.colorCount,
      showGrid: settings.showGrid,
      gridColor: settings.gridColor,
      pixelColors,
      selectedColorHexes,
    });

    downloadBlob(pngBlob, getPixelGridPngFileName(fileName));
  };

  const reset = () => {
    resetImage();
    settings.resetSettings();
  };

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="control-stack">
          <ControlPanel
            fileName={fileName}
            fileInputRef={fileInputRef}
            colorCount={settings.colorCount}
            gridColor={settings.gridColor}
            hasImage={Boolean(image)}
            outputInfo={outputInfo}
            pixelSize={settings.pixelSize}
            showGrid={settings.showGrid}
            onDownload={downloadPdf}
            onFileChange={handleFileChange}
            onFileDrop={handleDrop}
            onColorCountChange={settings.setColorCount}
            onGridColorChange={settings.setGridColor}
            onPixelSizeChange={settings.setPixelSize}
            onReset={reset}
            onShowGridChange={settings.setShowGrid}
          />
        </div>
        <PreviewPanel
          canvasRef={canvasRef}
          canDownloadPng={Boolean(image && selectedColorHexes.length > 0)}
          hasImage={Boolean(image)}
          onDownloadPng={downloadPng}
          previewInfo={previewInfo}
          previewRef={previewRef}
        />
        {image && (
          <PalettePanel
            isOpen={settings.showColors}
            pixelColors={pixelColors}
            selectedColorHexes={selectedColorHexes}
            onColorSelect={settings.toggleSelectedColorHex}
            onOpenChange={settings.setShowColors}
          />
        )}
      </section>
    </main>
  );
}
