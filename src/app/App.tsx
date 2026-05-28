import { ControlPanel } from '../components/ControlPanel';
import { PreviewPanel } from '../components/PreviewPanel';
import { useImageUpload } from '../hooks/useImageUpload';
import { usePixelArtPreview } from '../hooks/usePixelArtPreview';
import { usePixelGridSettings } from '../hooks/usePixelGridSettings';
import { downloadBlob } from '../services/downloadFile';
import { createPixelGridPdfBlob, getPixelGridPdfFileName } from '../services/exportPixelGridPdf';

export function App() {
  const { fileInputRef, fileName, handleDrop, handleFileChange, image, resetImage } =
    useImageUpload();
  const settings = usePixelGridSettings();
  const { canvasRef, outputInfo, pixelColors, previewInfo, previewRef } = usePixelArtPreview({
    image,
    pixelSize: settings.pixelSize,
    colorCount: settings.colorCount,
    showGrid: settings.showGrid,
    gridColor: settings.gridColor,
  });

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

  const reset = () => {
    resetImage();
    settings.resetSettings();
  };

  return (
    <main className="app-shell">
      <section className="workspace">
        <ControlPanel
          fileName={fileName}
          fileInputRef={fileInputRef}
          colorCount={settings.colorCount}
          gridColor={settings.gridColor}
          hasImage={Boolean(image)}
          outputInfo={outputInfo}
          pixelColors={pixelColors}
          pixelSize={settings.pixelSize}
          showColors={settings.showColors}
          showGrid={settings.showGrid}
          onDownload={downloadPdf}
          onFileChange={handleFileChange}
          onFileDrop={handleDrop}
          onColorCountChange={settings.setColorCount}
          onGridColorChange={settings.setGridColor}
          onPixelSizeChange={settings.setPixelSize}
          onReset={reset}
          onShowColorsChange={settings.setShowColors}
          onShowGridChange={settings.setShowGrid}
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
