import { useCallback, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { isImageFile, loadImageFile } from '../services/imageFile';

export function useImageUpload() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadFile = useCallback((file?: File) => {
    if (!isImageFile(file)) {
      return;
    }

    void loadImageFile(file).then(({ image: nextImage, fileName: nextFileName }) => {
      setImage(nextImage);
      setFileName(nextFileName);
    });
  }, []);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      loadFile(event.target.files?.[0]);
    },
    [loadFile],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      loadFile(event.dataTransfer.files?.[0]);
    },
    [loadFile],
  );

  const resetImage = useCallback(() => {
    setImage(null);
    setFileName('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return {
    fileInputRef,
    fileName,
    handleDrop,
    handleFileChange,
    image,
    resetImage,
  };
}
