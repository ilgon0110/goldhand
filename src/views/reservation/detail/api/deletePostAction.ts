import { useState } from 'react';

import { fetcher } from '@/app/utils/fetcher.client';

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

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

const deletePostMutation = async ({ docId, userId, password }: TDeletePostActionParams) => {
  try {
    const res = await fetcher<IResponseBody>(`/api/consultDetail/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        docId,
        userId,
        password,
      }),
    });
    return res;
  } catch (error) {
    console.error('Error during form submission:', error);
    throw new Error('게시글 삭제 중 서버 오류가 발생하였습니다.');
  }
};
