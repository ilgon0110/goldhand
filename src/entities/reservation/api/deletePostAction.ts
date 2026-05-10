'use server';

import { fetcher } from '@/src/shared/utils/fetcher.client';

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

export const deletePostMutation = async ({ docId, userId, password }: TDeletePostActionParams) => {
  try {
    const res = await fetcher<IResponseBody>(`/api/reservation/delete`, {
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
