'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { useComments } from '@/src/entities/comment';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { useReviewDetailCommentMutation } from '../api/useReviewDetailCommentMutation';
import { reviewCommentSchema } from '../config/reviewCommentSchema';

export function useReviewComment(docId: string) {
  const form = useForm<z.infer<typeof reviewCommentSchema>>({
    resolver: zodResolver(reviewCommentSchema),
    defaultValues: { comment: '' },
    mode: 'onChange',
  });
  const { comments } = useComments({ docId, collectionName: 'reviews' });
  const { mutate: submitComment, isPending } = useReviewDetailCommentMutation(docId, {
    onSuccess: () => {
      toastSuccess('댓글이 작성되었습니다.');
      form.reset();
    },
    onError: error => toastError('댓글 작성에 실패하였습니다.\n' + error.message),
  });

  const handleSubmit = (values: z.infer<typeof reviewCommentSchema>) => submitComment(values.comment);

  return { comments, form, handleSubmit, isPending };
}

export type TReviewCommentController = ReturnType<typeof useReviewComment>;
