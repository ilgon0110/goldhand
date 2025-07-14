import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { toastError } from '@/src/shared/utils';

import { kakaoLoginAction } from './kakaoLoginAction';

type TKakaoLoginParams = {
  code: string | null;
  error: string | null;
  error_description: string | null;
  state: string | null;
};

export const useKakaoLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');
  const state = searchParams.get('state');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (error) {
      console.error('Kakao login error:', error, error_description);
      setIsLoading(false);
      toastError(error_description || '카카오 로그인에 실패했습니다.');
      return;
    }

    if (!code) return;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        // 쿠키 저장을 위해 server action 사용
        const postData = await kakaoLoginAction(code);

        if (postData.response === 'rejoin') {
          // Handle rejoin logic here
          return;
        }

        if (postData.response !== 'ok') {
          toastError(postData.message || '로그인에 실패했습니다.');
          return;
        }

        if (postData.redirectTo) {
          router.replace(postData.redirectTo);
        }
      } catch (error) {
        console.error(error);
        toastError('로그인 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [code, error, router, error_description, state]);

  return { isLoading, isError: !!error, error_description };
};
