export async function optimizeImage(
  file: File,
  maxWidth = 1200,
  quality = 0.8,
  mimeType = 'image/webp',
): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('optimizeImage can only be used in a browser environment');
  }
  try {
    const bitmap = await createImageBitmap(file);
    const ratio = Math.min(1, maxWidth / bitmap.width);
    const width = Math.round(bitmap.width * ratio);
    const height = Math.round(bitmap.height * ratio);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas 2D context');
    ctx.drawImage(bitmap, 0, 0, width, height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (blob) resolve(blob);
          else reject(new Error('Image optimization failed'));
        },
        mimeType,
        quality,
      );
    });
  } catch {
    // fallback : 원본 파일 반환
    return await new Promise<Blob>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, maxWidth / img.width);
        const width = Math.round(img.width * ratio);
        const height = Math.round(img.height * ratio);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas 2D context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          blob => {
            if (blob) resolve(blob);
            else reject(new Error('Image optimization failed'));
          },
          mimeType,
          quality,
        );
      };
      img.onerror = () => {
        reject(new Error('Failed to load image for optimization'));
      };
      img.src = URL.createObjectURL(file);
    });
  }
}
