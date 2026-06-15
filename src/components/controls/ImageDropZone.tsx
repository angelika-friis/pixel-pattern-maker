import type { ChangeEvent, DragEvent, RefObject } from 'react';
import { ImagePlus } from 'lucide-react';
import styles from './ImageDropZone.module.css';

type ImageDropZoneProps = {
  fileName: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFileDrop: (event: DragEvent<HTMLLabelElement>) => void;
};

export function ImageDropZone({
  fileName,
  fileInputRef,
  onFileChange,
  onFileDrop,
}: ImageDropZoneProps) {
  return (
    <label
      className={styles['drop-zone']}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onFileDrop}
    >
      <input
        ref={fileInputRef}
        className={styles['drop-zone-input']}
        type="file"
        accept="image/*"
        onChange={onFileChange}
      />
      <ImagePlus className={styles['drop-zone-icon']} aria-hidden="true" />
      <span className={styles['drop-zone-label']}>{fileName || 'Upload or drag in an image'}</span>
    </label>
  );
}
