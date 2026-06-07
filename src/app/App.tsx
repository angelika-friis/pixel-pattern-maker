import { useEffect } from 'react';
import { ControlPanel } from '../components/ControlPanel';
import { PalettePanel } from '../components/PalettePanel';
import { PreviewPanel } from '../components/PreviewPanel';
import { useImageUpload } from '../hooks/useImageUpload';
import { usePixelArtPreview } from '../hooks/usePixelArtPreview';
import { usePixelGridSettings } from '../hooks/usePixelGridSettings';
import { usePreviewZoom } from '../hooks/usePreviewZoom';
import { useTheme } from '../hooks/useTheme';
import { downloadBlob } from '../services/downloadFile';
import { createPixelGridPdfBlob, getPixelGridPdfFileName } from '../services/exportPixelGridPdf';
import { createPixelGridPngBlob, getPixelGridPngFileName } from '../services/exportPixelGridPng';

export function App() {
  const { fileInputRef, fileName, handleDrop, handleFileChange, image, resetImage } =
    useImageUpload();
  const settings = usePixelGridSettings();
  const previewZoom = usePreviewZoom();
  const theme = useTheme();
  const { selectedColorHexes, setSelectedColorHexes } = settings;
  const { canvasRef, outputInfo, pixelColors, previewInfo, previewRef, processedImageData } =
    usePixelArtPreview({
      image,
      pixelSize: settings.pixelSize,
      colorCount: settings.colorCount,
      colorSaturation: settings.colorSaturation,
      imageContrast: settings.imageContrast,
      showGrid: settings.showGrid,
      gridColor: settings.gridColor,
      previewZoom: previewZoom.previewZoom,
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
    if (!processedImageData || !outputInfo) {
      return;
    }

    const pdfBlob = createPixelGridPdfBlob({
      imageData: processedImageData,
      outputInfo,
      pixelSize: settings.pixelSize,
      showGrid: settings.showGrid,
      gridColor: settings.gridColor,
      pixelColors,
    });

    downloadBlob(pdfBlob, getPixelGridPdfFileName(fileName));
  };

  const downloadPng = async () => {
    if (!processedImageData || !outputInfo || selectedColorHexes.length === 0) {
      return;
    }

    const pngBlob = await createPixelGridPngBlob({
      imageData: processedImageData,
      outputInfo,
      pixelSize: settings.pixelSize,
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
    previewZoom.resetPreviewZoom();
  };

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="control-stack">
          <ControlPanel
            fileName={fileName}
            fileInputRef={fileInputRef}
            colorCount={settings.colorCount}
            colorSaturation={settings.colorSaturation}
            gridColor={settings.gridColor}
            hasImage={Boolean(image)}
            imageContrast={settings.imageContrast}
            outputInfo={outputInfo}
            pixelSize={settings.pixelSize}
            showGrid={settings.showGrid}
            themeMode={theme.themeMode}
            onDownload={downloadPdf}
            onFileChange={handleFileChange}
            onFileDrop={handleDrop}
            onColorCountChange={settings.setColorCount}
            onColorSaturationChange={settings.setColorSaturation}
            onGridColorChange={settings.setGridColor}
            onImageContrastChange={settings.setImageContrast}
            onPixelSizeChange={settings.setPixelSize}
            onReset={reset}
            onShowGridChange={settings.setShowGrid}
            onThemeToggle={theme.toggleThemeMode}
          />
        </div>
        <PreviewPanel
          canvasRef={canvasRef}
          canDownloadPng={Boolean(image && selectedColorHexes.length > 0)}
          hasImage={Boolean(image)}
          onDownloadPng={downloadPng}
          onPreviewZoomChange={previewZoom.setPreviewZoom}
          onPreviewZoomIn={previewZoom.zoomIn}
          onPreviewZoomOut={previewZoom.zoomOut}
          onPreviewZoomReset={previewZoom.resetPreviewZoom}
          previewInfo={previewInfo}
          previewRef={previewRef}
          previewZoom={previewZoom.previewZoom}
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
