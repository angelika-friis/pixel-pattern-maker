import { useEffect } from 'react';
import type { ComponentProps } from 'react';
import { ControlPanel } from '../../components/ControlPanel';
import { PalettePanel } from '../../components/PalettePanel';
import { PreviewPanel } from '../../components/PreviewPanel';
import { useImageUpload } from '../../hooks/useImageUpload';
import { usePixelArtPreview } from '../../hooks/usePixelArtPreview';
import { usePixelGridSettings } from '../../hooks/usePixelGridSettings';
import { usePreviewZoom } from '../../hooks/usePreviewZoom';
import { useTheme } from '../../hooks/useTheme';
import { downloadBlob } from '../../services/downloadFile';
import { createPixelGridPdfBlob, getPixelGridPdfFileName } from '../../services/exportPixelGridPdf';
import { createPixelGridPngBlob, getPixelGridPngFileName } from '../../services/exportPixelGridPng';

type ControlPanelProps = ComponentProps<typeof ControlPanel>;
type PreviewPanelProps = ComponentProps<typeof PreviewPanel>;
type PalettePanelProps = ComponentProps<typeof PalettePanel>;

type HomeWorkspace = {
  controlPanelProps: ControlPanelProps;
  previewPanelProps: PreviewPanelProps;
  palettePanelProps: PalettePanelProps | null;
};

export function useHomeWorkspace(): HomeWorkspace {
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

  return {
    controlPanelProps: {
      fileName,
      fileInputRef,
      colorCount: settings.colorCount,
      colorSaturation: settings.colorSaturation,
      gridColor: settings.gridColor,
      hasImage: Boolean(image),
      imageContrast: settings.imageContrast,
      outputInfo,
      pixelSize: settings.pixelSize,
      showGrid: settings.showGrid,
      themeMode: theme.themeMode,
      onDownload: downloadPdf,
      onFileChange: handleFileChange,
      onFileDrop: handleDrop,
      onColorCountChange: settings.setColorCount,
      onColorSaturationChange: settings.setColorSaturation,
      onGridColorChange: settings.setGridColor,
      onImageContrastChange: settings.setImageContrast,
      onPixelSizeChange: settings.setPixelSize,
      onReset: reset,
      onShowGridChange: settings.setShowGrid,
      onThemeToggle: theme.toggleThemeMode,
    },
    previewPanelProps: {
      canvasRef,
      canDownloadPng: Boolean(image && selectedColorHexes.length > 0),
      hasImage: Boolean(image),
      onDownloadPng: downloadPng,
      onPreviewZoomChange: previewZoom.setPreviewZoom,
      onPreviewZoomIn: previewZoom.zoomIn,
      onPreviewZoomOut: previewZoom.zoomOut,
      onPreviewZoomReset: previewZoom.resetPreviewZoom,
      previewInfo,
      previewRef,
      previewZoom: previewZoom.previewZoom,
    },
    palettePanelProps: image
      ? {
          isOpen: settings.showColors,
          pixelColors,
          selectedColorHexes,
          onColorSelect: settings.toggleSelectedColorHex,
          onOpenChange: settings.setShowColors,
        }
      : null,
  };
}
