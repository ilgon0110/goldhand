import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { UserCredential } from 'firebase/auth';

import { fetcher } from '@/app/utils';

interface INaverAuthRes {
  email?: string;
  redirectTo?: string;
}

interface IResponsePostBody {
  response: string;
  message: string;
  redirectTo: string;
  user: UserCredential | null;
  accessToken: string | null;
  customToken?: string;
  email?: string | null;
}

export function useNaverLoginMutation(options?: UseMutationOptions<IResponsePostBody, Error, void>) {
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const access_token = window.location.hash.split('=')[1]?.split('&')[0];
      if (access_token == null) {
        throw new Error('Access token is null');
      }

      const postData = await fetcher<IResponsePostBody>('/api/auth/naver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token }),
        cache: 'no-store',
      });

      return postData;
    },
    ...options,
  });

  return {
    isPending,
    mutate,
  };
}
