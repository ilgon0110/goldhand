export async function generateThumbnail(
  file: File,
  maxWidth = 200, // 썸네일은 아주 작게
  quality = 0.5, // 기본 품질 낮게 (용량 최소화 목적)
  mimeType = 'image/webp',
): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('generateThumbnail can only be used in a browser environment');
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
          else reject(new Error('Thumbnail generation failed'));
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
            if (!blob || blob.type !== mimeType) {
              // 최적화 포맷 인코딩 실패 → jpeg로 강제 변환
              canvas.toBlob(fallbackBlob => resolve(fallbackBlob!), 'image/jpeg', quality);
            } else {
              resolve(blob);
            }
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
