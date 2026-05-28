export type LoadedImageFile = {
  image: HTMLImageElement;
  fileName: string;
};

export function isImageFile(file?: File): file is File {
  return Boolean(file?.type.startsWith('image/'));
}

export function loadImageFile(file: File): Promise<LoadedImageFile> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ image, fileName: file.name });
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not load image file: ${file.name}`));
    };

    image.src = url;
  });
}
