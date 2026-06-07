import type { ChangeEvent, DragEvent, RefObject } from 'react';
import { ImagePlus } from 'lucide-react';

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
    <label className="drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={onFileDrop}>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} />
      <ImagePlus aria-hidden="true" />
      <span>{fileName || 'Upload or drag in an image'}</span>
    </label>
  );
}
