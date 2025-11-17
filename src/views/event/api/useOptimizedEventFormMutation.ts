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

import type { eventFormSchema } from '../config/eventFormSchema';

interface IEventPostData {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  docId: string;
}

interface IEventFormMutationProps {
  title: string;
  name: string;
  htmlString: string;
  docId: string;
  images: { key: string; url: string }[] | null;
  status: string;
}

export const useOptimizedEventFormMutation = (
  mode: 'create' | 'update',
  dId?: string,
  options?: UseMutationOptions<IEventPostData, Error, IEventFormMutationProps>,
) => {
  const [eventFormEditor, setEventFormEditor] = useState<LexicalEditor>();
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
    mutationFn: async (data: IEventFormMutationProps) => {
      const eventData = await fetcher<IEventPostData>(`/api/event/${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'no-store',
      });

      return eventData;
    },
    onSuccess: res => {
      toastSuccess('이벤트가 성공적으로 업로드되었습니다.\n잠시 후 작성한 이벤트 페이지로 이동합니다.');
      // 3초 후에 페이지 이동
      setTimeout(() => {
        router.replace(`/event/${res.docId}`);
      }, 3000);
    },
    onError: error => {
      toastError('이벤트 업로드 중 오류가 발생했습니다. : ' + error.message);
    },
    onSettled: () => {
      setIsSubmitting(false);
      setImagesProgress(undefined);
    },
    ...options,
  });

  const handleChangeEventFormEditor = (editor: LexicalEditor) => {
    setEventFormEditor(editor);
  };

  const resetImageProgress = () => {
    setImagesProgress(undefined);
  };

  const handleChangeOptimizing = (state: boolean) => {
    setIsOptimizing(state);
  };

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    // editor validation
    if (eventFormEditor === undefined) return;
    eventFormEditor.read(() => {
      const htmlString = $generateHtmlFromNodes(eventFormEditor, null);
      const downloadedImages: { key: string; url: string }[] = [];
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
          htmlString,
          docId,
          images: downloadedImages,
          status: values.status,
        });
      }
    });
  };

  return {
    onSubmit,
    handleChangeEventFormEditor,
    eventFormEditor,
    isSubmitting,
    imageProgress,
    isOptimizing,
    resetImageProgress,
  };
};

interface IUploadImageParams {
  userId: string;
  docId: string;
  images: IImagesContextFile[] | null;
  handleChangeImageprocess: (progress: { key: string; progress: number } | undefined) => void;
  mutate: UseMutateFunction<IEventPostData, Error, IEventFormMutationProps, unknown>;
  values: z.infer<typeof eventFormSchema>;
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

      const imageRef = ref(storage, `events/${userId}/${docId}/${fileName}`);
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
              // htmlString 중 img 태그는 유지하면서 src의 속성만 제거
              const cleanedHtmlString = htmlString.replace(
                /<img\s+[^>]*src=["']data:image\/[^"']*["'][^>]*>/gi,
                match => {
                  // src 속성을 ""로 바꾼 새로운 img 태그를 반환
                  return match.replace(/src=["']data:image\/[^"']*["']/, 'src=""');
                },
              );
              mutate({
                title: values.title,
                name: values.name,
                status: values.status,
                htmlString: cleanedHtmlString,
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
          status: values.status,
          htmlString,
          docId,
          images: downloadedImages,
        });
      }
    }
  }
}
