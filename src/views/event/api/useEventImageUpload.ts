'use client';

import { useRef, useState } from 'react';

import { generateThumbnail, optimizeImage, uploadSingleImage } from '@/src/entities/image';
import { toastError } from '@/src/shared/utils';
import type { IImagesContextFile } from '@/src/widgets/editor/context/ImagesContext';

export function useEventImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [imageProgress, setImageProgress] = useState<{ key: string; progress: number }>();
  const completionRef = useRef<{ count: number; images: { key: string; url: string }[] }>({
    count: 0,
    images: [],
  });

  const uploadImages = async (
    userId: string,
    docId: string,
    images: IImagesContextFile[],
    onAllComplete: (uploadedImages: { key: string; url: string }[]) => void,
  ) => {
    const total = images.length + 1; // +1 for thumbnail
    completionRef.current = { count: 0, images: [] };
    setIsUploading(true);

    // 썸네일/이미지 구분 없이 동일한 완료 핸들러로 count 관리 → race condition 방지
    const handleUploadComplete = (key: string, url: string) => {
      completionRef.current.images.push({ key, url });
      completionRef.current.count += 1;

      if (completionRef.current.count === total) {
        setIsUploading(false);
        setImageProgress({ key: '업로드 완료. 잠시만 기다려주세요.', progress: 100 });
        onAllComplete(completionRef.current.images);
      }
    };

    // 썸네일 생성 + 업로드
    const thumbnail = await generateThumbnail(images[0].file);
    uploadSingleImage({
      file: thumbnail,
      storagePath: `events/${userId}/${docId}/thumbnail`,
      metadata: { contentType: thumbnail.type, customMetadata: { userId } },
      onProgress: progress => setImageProgress({ key: 'thumbnail', progress }),
      onComplete: url => handleUploadComplete('thumbnail', url),
      onError: error => {
        toastError('썸네일 업로드 중 오류가 발생했습니다. : ' + error.message);
        handleUploadComplete('thumbnail', '');
      },
    });

    // 각 이미지 최적화 + 업로드
    for (const image of images) {
      let uploadFile: Blob | File = image.file;
      let fileName = image.key;

      try {
        setIsOptimizing(true);
        const optimized = await optimizeImage(image.file, 1200, 0.8, 'image/webp');
        fileName = `${image.key.replace(/\.[^/.]+$/, '')}.webp`;
        uploadFile = new File([optimized], fileName, { type: 'image/webp' });
      } catch {
        toastError('이미지 최적화에 실패하여 원본 파일을 업로드합니다.');
      } finally {
        setIsOptimizing(false);
      }

      uploadSingleImage({
        file: uploadFile,
        storagePath: `events/${userId}/${docId}/${fileName}`,
        metadata: { contentType: (uploadFile as File).type || image.file.type, customMetadata: { userId } },
        onProgress: progress => setImageProgress({ key: image.key, progress }),
        onComplete: url => handleUploadComplete(image.key, url),
        onError: error => {
          toastError('이미지 업로드 중 오류가 발생했습니다. : ' + error.message);
          handleUploadComplete(image.key, '');
        },
      });
    }
  };

  return {
    uploadImages,
    isUploading,
    isOptimizing,
    imageProgress,
    resetImageProgress: () => setImageProgress(undefined),
  };
}
