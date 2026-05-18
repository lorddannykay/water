const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.8;
const SKIP_COMPRESSION_BYTES = 400 * 1024;

export type CompressedImage = {
  blob: Blob;
  sizeKb: number;
  skippedCompression: boolean;
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image.'));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not compress image.'))),
      type,
      quality,
    );
  });
}

export async function compressImage(file: File): Promise<CompressedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }

  if (file.size < SKIP_COMPRESSION_BYTES) {
    return {
      blob: file,
      sizeKb: Math.round(file.size / 1024),
      skippedCompression: true,
    };
  }

  const img = await loadImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process image.');

  ctx.drawImage(img, 0, 0, width, height);
  const blob = await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY);

  return {
    blob,
    sizeKb: Math.round(blob.size / 1024),
    skippedCompression: false,
  };
}

export function formatSizeKb(sizeKb: number): string {
  return sizeKb < 1024 ? `${sizeKb} KB` : `${(sizeKb / 1024).toFixed(1)} MB`;
}
