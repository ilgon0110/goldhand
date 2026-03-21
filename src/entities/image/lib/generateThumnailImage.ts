export async function generateThumbnail(
  file: File,
  maxWidth = 200, // 썸네일은 아주 작게
  quality = 0.5, // 기본 품질 낮게 (용량 최소화 목적)
  mimeType = 'image/webp',
): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('generateThumbnail can only be used in a browser environment');
  }
  const convertToJpeg = (canvas: HTMLCanvasElement, blob: Blob | null): Promise<Blob> => {
    return new Promise(resolve => {
      // webp 실패 → JPEG로 강제 변환
      if (!blob || blob.type !== mimeType) {
        canvas.toBlob(b => resolve(b!), 'image/jpeg', quality);
      } else {
        resolve(blob);
      }
    });
  };

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

    return await new Promise<Blob>(resolve => {
      canvas.toBlob(
        async blob => {
          const finalBlob = await convertToJpeg(canvas, blob);
          resolve(finalBlob);
        },
        mimeType,
        quality,
      );
    });
  } catch {
    // fallback (Safari 등 createImageBitmap 미지원)
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
          async blob => {
            const finalBlob = await convertToJpeg(canvas, blob);
            resolve(finalBlob);
          },
          mimeType,
          quality,
        );
      };

      img.onerror = () => reject(new Error('Failed to load image for thumbnail generation'));
      img.src = URL.createObjectURL(file);
    });
  }
}
