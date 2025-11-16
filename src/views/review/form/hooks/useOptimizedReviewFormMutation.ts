import { $generateHtmlFromNodes } from '@lexical/html';
import type { UseMutateFunction, UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { UploadMetadata } from 'firebase/storage';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import type { LexicalEditor } from 'lexical';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type z from 'zod';

import { firebaseApp } from '@/src/shared/config/firebase';
import { useAuth } from '@/src/shared/hooks/useAuth';
import type { TAliasAny } from '@/src/shared/types';
import { toastError, toastSuccess } from '@/src/shared/utils';
import { fetcher } from '@/src/shared/utils/fetcher.client';
import { optimizeImage } from '@/src/shared/utils/optimizeImage';
import type { IImagesContextFile } from '@/src/widgets/editor/context/ImagesContext';
import { useImagesContext } from '@/src/widgets/editor/context/ImagesContext';

import type { reviewFormSchema } from '../config/reviewFormSchema';

interface IReviewPostData {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  docId: string;
}

interface IReviewFormMutationProps {
  title: string;
  name: string;
  franchisee: string;
  htmlString: string;
  docId: string;
  images: { key: string; url: string }[] | null;
}

export const useOptimizedReviewFormMutation = (
  mode: 'create' | 'update',
  dId?: string,
  options?: UseMutationOptions<IReviewPostData, Error, IReviewFormMutationProps>,
) => {
  const [reviewFormEditor, setReviewFormEditor] = useState<LexicalEditor>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { images } = useImagesContext();
  const { userData } = useAuth();
  const [imageProgress, setImagesProgress] = useState<{
    key: string;
    progress: number;
  }>();
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: async (data: IReviewFormMutationProps) => {
      const reviewData = await fetcher<IReviewPostData>(`/api/review/${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'no-store',
      });

      return reviewData;
    },
    onSuccess: res => {
      toastSuccess('후기가 성공적으로 업로드되었습니다.\n잠시 후 작성후기로 이동합니다.');
      // 3초 후에 페이지 이동
      setTimeout(() => {
        router.replace(`/review/${res.docId}`);
      }, 3000);
    },
    onError: error => {
      toastError('후기 업로드 중 오류가 발생했습니다.\n' + error.message);
      console.error(`후기 업로드 중 오류가 발생했습니다.\n${error}`);
      setTimeout(() => {
        router.replace(`/review`);
      }, 2000);
    },
    onSettled: () => {
      setIsSubmitting(false);
      setImagesProgress(undefined);
    },
    ...options,
  });

  const handleChangeReviewFormEditor = (editor: LexicalEditor) => {
    setReviewFormEditor(editor);
  };

  const resetImageProgress = () => {
    setImagesProgress(undefined);
  };

  const handleChangeOptimizing = (state: boolean) => {
    setIsOptimizing(state);
  };

  const onSubmit = async (values: z.infer<typeof reviewFormSchema>) => {
    // editor validation
    if (reviewFormEditor === undefined) return;
    reviewFormEditor.read(async () => {
      const htmlString = $generateHtmlFromNodes(reviewFormEditor, null);
      const docId = dId || uuidv4();
      setIsSubmitting(true);

      if (userData != null) {
        // 이미지 있을 때 업로드 로직
        if (images != null && images.length > 0) {
          uploadImage({
            userId: userData.userId,
            docId,
            images,
            handleChangeImageprocess: setImagesProgress,
            mutate,
            values,
            htmlString,
            handleChangeOptimizing,
          });
          return;
        }

        // 이미지 없을 때 업로드 로직
        mutate({
          title: values.title,
          name: values.name,
          franchisee: values.franchisee,
          htmlString,
          docId,
          images: null,
        });
      }
    });
  };

  return {
    onSubmit,
    handleChangeReviewFormEditor,
    reviewFormEditor,
    isSubmitting,
    imageProgress,
    resetImageProgress,
    isOptimizing,
  };
};

interface IUploadImageParams {
  userId: string;
  docId: string;
  images: IImagesContextFile[] | null;
  handleChangeImageprocess: (progress: { key: string; progress: number } | undefined) => void;
  mutate: UseMutateFunction<IReviewPostData, Error, IReviewFormMutationProps, unknown>;
  values: z.infer<typeof reviewFormSchema>;
  htmlString: string;
  handleChangeOptimizing: (state: boolean) => void;
}

async function uploadImage({
  userId,
  docId,
  images,
  handleChangeImageprocess,
  mutate,
  values,
  htmlString,
  handleChangeOptimizing,
}: IUploadImageParams) {
  if (images == null || images.length === 0 || !images) return;
  const storage = getStorage(firebaseApp);
  const downloadedImages: { key: string; url: string }[] = [];
  const total = images.length;

  for (const image of images) {
    try {
      // 최적화 시도
      let uploadFile: Blob | File = image.file;
      let fileName = image.key;
      try {
        handleChangeOptimizing(true);
        const optimized = await optimizeImage(image.file, 1200, 0.8, 'image/webp');
        const exceptionExtension = image.key.replace(/\.[^/.]+$/, '');
        fileName = `${exceptionExtension}.webp`;
        uploadFile = new File([optimized], fileName, { type: 'image/webp' });
      } catch (optimizedError) {
        // 최적화 실패 시 원본 파일 업로드
        toastError('이미지 최적화에 실패하여 원본 파일을 업로드합니다.');
        console.warn('이미지 최적화에 실패하여 원본 파일을 업로드합니다.', optimizedError);
      } finally {
        handleChangeOptimizing(false);
      }

      const metadata: UploadMetadata = {
        contentType: (uploadFile as TAliasAny).type || image.file.type,
        customMetadata: {
          userId: userId,
        },
      };

      const imageRef = ref(storage, `reviews/${userId}/${docId}/${fileName}`);
      const uploadTask = uploadBytesResumable(imageRef, uploadFile, metadata);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          handleChangeImageprocess({ key: image.key, progress });
        },
        error => {
          handleChangeImageprocess(undefined);
          toastError('이미지 업로드 중 오류가 발생했습니다. : ' + error.message);
          downloadedImages.push({
            key: image.key,
            url: '',
          });
        },
        () => {
          handleChangeImageprocess(undefined);
          getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
            downloadedImages.push({
              key: image.key,
              url: downloadURL,
            });
            // 모든 이미지 업로드가 완료되면 서버에 요청
            if (downloadedImages.length === total) {
              handleChangeImageprocess({
                key: '이미지 업로드 완료. 잠시만 기다려주세요.',
                progress: 100,
              });
              //postReview(values, htmlString, docId, downloadedImages);
              mutate({
                title: values.title,
                name: values.name,
                franchisee: values.franchisee,
                htmlString,
                docId,
                images: downloadedImages,
              });
            }
          });
        },
      );
    } catch (err) {
      toastError('이미지 업로드 중 알 수 없는 오류가 발생했습니다. : ' + (err as Error).message);
      downloadedImages.push({
        key: image.key,
        url: '',
      });

      if (downloadedImages.length === total) {
        handleChangeImageprocess({
          key: '이미지 업로드 완료. 잠시만 기다려주세요.',
          progress: 100,
        });
        //postReview(values, htmlString, docId, downloadedImages);
        mutate({
          title: values.title,
          name: values.name,
          franchisee: values.franchisee,
          htmlString,
          docId,
          images: downloadedImages,
        });
      }
    }
  }
}
