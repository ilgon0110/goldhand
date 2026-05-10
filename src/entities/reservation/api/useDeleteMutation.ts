'use client';

import { useState } from 'react';

import { deletePostMutation } from './deletePostAction';

type TDeletePostActionParams = {
  docId: string;
  userId: string | null;
  password: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onSettled?: () => void;
};

export const useDeletePostMutation = ({
  docId,
  userId,
  password,
  onSuccess,
  onError,
  onSettled,
}: TDeletePostActionParams) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await deletePostMutation({ docId, userId, password });
      if (response.response === 'ok') {
        onSuccess?.();
      } else {
        setError(response.message);
        onError?.(response.message);
      }
    } catch (err) {
      console.error('Error during post deletion:', err);
      setError('게시글 삭제 중 서버 오류가 발생하였습니다.');
      onError?.('게시글 삭제 중 서버 오류가 발생하였습니다.');
    } finally {
      setIsSubmitting(false);
      onSettled?.();
    }
  };

  return {
    mutate,
    isPending: isSubmitting,
    error,
  };
};
