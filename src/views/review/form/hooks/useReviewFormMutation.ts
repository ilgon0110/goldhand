import { $generateHtmlFromNodes } from '@lexical/html';
import type { UseMutationOptions } from '@tanstack/react-query';
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
import { toastError, toastSuccess } from '@/src/shared/utils';
import { fetcher } from '@/src/shared/utils/fetcher.client';
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

export const useReviewFormMutation = (
  mode: 'create' | 'update',
  dId?: string,
  options?: UseMutationOptions<IReviewPostData, Error, IReviewFormMutationProps>,
) => {
  const [reviewFormEditor, setReviewFormEditor] = useState<LexicalEditor>();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      toastError('후기 업로드 중 오류가 발생했습니다.');
      console.error(`후기 업로드 중 오류가 발생했습니다.\n${error}`);
    },
    ...options,
  });

  const handleChangeReviewFormEditor = (editor: LexicalEditor) => {
    setReviewFormEditor(editor);
  };

  const resetImageProgress = () => {
    setImagesProgress(undefined);
  };

  const onSubmit = async (values: z.infer<typeof reviewFormSchema>) => {
    // editor validation
    if (reviewFormEditor === undefined) return;
    reviewFormEditor.read(async () => {
      const htmlString = $generateHtmlFromNodes(reviewFormEditor, null);
      const downloadedImages: { key: string; url: string }[] = [];
      const docId = dId || uuidv4();
      setIsSubmitting(true);

      if (userData != null) {
        const storage = getStorage(firebaseApp);
        // 이미지 있을 때 업로드 로직
        if (images != null && images.length > 0) {
          for (const image of images) {
            const metadata: UploadMetadata = {
              contentType: image.file.type,
              customMetadata: {
                userId: userData.userId,
              },
            };

            const imageRef = ref(storage, `reviews/${userData.userId}/${docId}/${image.key}`);
            const uploadTask = uploadBytesResumable(imageRef, image.file, metadata);

            uploadTask.on(
              'state_changed',
              snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImagesProgress({ key: image.file.name, progress });
              },
              error => {
                setImagesProgress(undefined);
                toastError('이미지 업로드 중 오류가 발생했습니다. : ' + error.message);
                downloadedImages.push({
                  key: image.key,
                  url: '',
                });
              },
              () => {
                setImagesProgress(undefined);
                getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
                  downloadedImages.push({
                    key: image.key,
                    url: downloadURL,
                  });
                  // 모든 이미지 업로드가 완료되면 서버에 요청
                  if (downloadedImages.length === images.length) {
                    setImagesProgress({
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
          }
        } else {
          //postReview(values, htmlString, docId, null);
          mutate({
            title: values.title,
            name: values.name,
            franchisee: values.franchisee,
            htmlString,
            docId,
            images: null,
          });
        }
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
  };
};
