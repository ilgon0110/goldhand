'use client';

import { $generateHtmlFromNodes } from '@lexical/html';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { LexicalEditor } from 'lexical';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useGetUserData } from '@/src/entities/user';
import { reviewKeys } from '@/src/shared/config/queryKeys';
import { toastError, toastSuccess } from '@/src/shared/utils';
import { fetcher } from '@/src/shared/utils/fetcher.client';
import { useImagesContext } from '@/src/widgets/editor/context/ImagesContext';

import { useReviewImageUpload } from './useReviewImageUpload';

interface IReviewPostData {
  response: 'ng' | 'ok';
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
  phoneIdToken?: string;
}

// create/edit 스키마가 다르므로(agreePersonalInfo 등), onSubmit은 실제 사용하는 필드만 구조적으로 요구한다.
interface IReviewFormSubmitValues {
  title: string;
  name: string;
  franchisee: string;
  isGuestPost: boolean;
}

function stripDataUriSrcs(html: string): string {
  return html.replace(/<img\s+[^>]*src=["']data:image\/[^"']*["'][^>]*>/gi, match =>
    match.replace(/src=["']data:image\/[^"']*["']/, 'src=""'),
  );
}

export const useReviewFormMutation = (
  mode: 'create' | 'update',
  dId?: string,
  options?: UseMutationOptions<IReviewPostData, Error, IReviewFormMutationProps>,
) => {
  const [reviewFormEditor, setReviewFormEditor] = useState<LexicalEditor>();
  const { images } = useImagesContext();
  const { data: userData } = useGetUserData();
  const router = useRouter();

  const queryClient = useQueryClient();
  const { uploadImages, isUploading, isOptimizing, imageProgress, resetImageProgress } = useReviewImageUpload();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: IReviewFormMutationProps) =>
      fetcher<IReviewPostData>(`/api/review/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        cache: 'no-store',
      }),
    onSuccess: res => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toastSuccess('후기가 성공적으로 업로드되었습니다.\n잠시 후 작성후기로 이동합니다.');
      setTimeout(() => {
        router.replace(`/review/${res.docId}`);
        router.refresh();
      }, 3000);
    },
    onError: error => {
      toastError('후기 업로드 중 오류가 발생했습니다.\n' + error.message);
      console.error(`후기 업로드 중 오류가 발생했습니다.\n${error}`);
      setTimeout(() => router.replace(`/review`), 2000);
    },
    ...options,
  });

  const isSubmitting = isUploading || isPending;

  const onSubmit = async (values: IReviewFormSubmitValues, phoneIdToken?: string | null) => {
    if (!reviewFormEditor) return;

    let htmlString = '';
    reviewFormEditor.read(() => {
      htmlString = $generateHtmlFromNodes(reviewFormEditor, null);
    });

    const docId = dId || uuidv4();
    const guestPhoneIdToken = values.isGuestPost ? phoneIdToken || undefined : undefined;
    const userId = userData.userData?.userId ?? null;

    if (!images || images.length === 0) {
      mutate({
        title: values.title,
        name: values.name,
        franchisee: values.franchisee,
        htmlString,
        docId,
        images: null,
        phoneIdToken: guestPhoneIdToken,
      });
      return;
    }

    const cleanedHtmlString = stripDataUriSrcs(htmlString);
    uploadImages(userId, docId, images, uploadedImages => {
      mutate({
        title: values.title,
        name: values.name,
        franchisee: values.franchisee,
        htmlString: cleanedHtmlString,
        docId,
        images: uploadedImages,
        phoneIdToken: guestPhoneIdToken,
      });
    });
  };

  return {
    onSubmit,
    handleChangeReviewFormEditor: setReviewFormEditor,
    reviewFormEditor,
    isSubmitting,
    imageProgress,
    isOptimizing,
    resetImageProgress,
  };
};
