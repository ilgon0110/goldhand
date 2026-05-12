'use client';

import { $generateHtmlFromNodes } from '@lexical/html';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { LexicalEditor } from 'lexical';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type z from 'zod';

import { useAuth } from '@/src/shared/hooks/useAuth';
import { toastError, toastSuccess } from '@/src/shared/utils';
import { fetcher } from '@/src/shared/utils/fetcher.client';
import { useImagesContext } from '@/src/widgets/editor/context/ImagesContext';

import type { eventFormSchema } from '../config/eventFormSchema';
import { useEventImageUpload } from './useEventImageUpload';

interface IEventPostData {
  response: 'expired' | 'ok' | 'ng';
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

function stripDataUriSrcs(html: string): string {
  return html.replace(/<img\s+[^>]*src=["']data:image\/[^"']*["'][^>]*>/gi, match =>
    match.replace(/src=["']data:image\/[^"']*["']/, 'src=""'),
  );
}

export const useEventFormMutation = (
  mode: 'create' | 'update',
  dId?: string,
  options?: UseMutationOptions<IEventPostData, Error, IEventFormMutationProps>,
) => {
  const [eventFormEditor, setEventFormEditor] = useState<LexicalEditor>();
  const { images } = useImagesContext();
  const { data: userData } = useAuth();
  const router = useRouter();

  const { uploadImages, isUploading, isOptimizing, imageProgress, resetImageProgress } = useEventImageUpload();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: IEventFormMutationProps) =>
      fetcher<IEventPostData>(`/api/event/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        cache: 'no-store',
      }),
    onSuccess: res => {
      toastSuccess('이벤트가 성공적으로 업로드되었습니다.\n잠시 후 작성한 이벤트 페이지로 이동합니다.');
      setTimeout(() => router.replace(`/event/${res.docId}`), 3000);
    },
    onError: error => {
      toastError('이벤트 업로드 중 오류가 발생했습니다. : ' + error.message);
    },
    ...options,
  });

  const isSubmitting = isUploading || isPending;

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    if (!eventFormEditor || userData == null || userData.userData == null) return;

    let htmlString = '';
    eventFormEditor.read(() => {
      htmlString = $generateHtmlFromNodes(eventFormEditor, null);
    });

    const docId = dId || uuidv4();

    if (!images || images.length === 0) {
      mutate({ title: values.title, name: values.name, htmlString, docId, images: [], status: values.status });
      return;
    }

    const cleanedHtmlString = stripDataUriSrcs(htmlString);
    uploadImages(userData.userData.userId, docId, images, uploadedImages => {
      mutate({
        title: values.title,
        name: values.name,
        htmlString: cleanedHtmlString,
        docId,
        images: uploadedImages,
        status: values.status,
      });
    });
  };

  return {
    onSubmit,
    handleChangeEventFormEditor: setEventFormEditor,
    eventFormEditor,
    isSubmitting,
    imageProgress,
    isOptimizing,
    resetImageProgress,
  };
};
