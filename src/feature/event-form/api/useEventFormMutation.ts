'use client';

import { $generateHtmlFromNodes } from '@lexical/html';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { LexicalEditor } from 'lexical';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type z from 'zod';

import type { eventFormSchema } from '@/src/entities/event';
import { useImagesContext } from '@/src/entities/image/client';
import { useUserSuspenseQuery } from '@/src/entities/user';
import { eventKeys } from '@/src/shared/config/queryKeys';
import { toastError, toastSuccess } from '@/src/shared/utils';
import { fetcher } from '@/src/shared/utils/fetcher.client';

import { useEventImageUpload } from './_useEventImageUpload';

interface IEventPostData {
  response: 'ng' | 'ok';
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
  const queryClient = useQueryClient();
  const [eventFormEditor, setEventFormEditor] = useState<LexicalEditor>();
  const { images } = useImagesContext();
  // user는 루트 layout이 스트리밍한다. suspense로 받아 user가 오기 전에 제출이 조용히 무시되지 않게 한다.
  const { data: userData } = useUserSuspenseQuery();
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
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      toastSuccess('소식이 성공적으로 업로드되었습니다.\n잠시 후 작성한 소식 페이지로 이동합니다.');
      setTimeout(() => {
        router.replace(`/event/${res.docId}`);
        router.refresh();
      }, 3000);
    },
    onError: error => {
      toastError('소식 업로드 중 오류가 발생했습니다. : ' + error.message);
    },
    ...options,
  });

  const isSubmitting = isUploading || isPending;

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    if (!eventFormEditor || userData.userData == null) return;

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
