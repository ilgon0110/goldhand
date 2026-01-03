import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import type { IUserDetailData } from '@/src/shared/types';
import { toastError } from '@/src/shared/utils';

import { kakaoLoginAction } from './kakaoLoginAction';

type TUseKakaoLogin = {
  isRejoinDialogOpen: boolean;
  setIsRejoinDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rejoinUserData: IUserDetailData | undefined;
  setRejoinUserData: React.Dispatch<React.SetStateAction<IUserDetailData | undefined>>;
  options?: {
    onSuccess?: () => void;
    onError?: (error: string) => void;
    onSettled?: () => void;
  };
};

export const useKakaoLogin = ({
  isRejoinDialogOpen,
  setIsRejoinDialogOpen,
  rejoinUserData,
  setRejoinUserData,
  options,
}: TUseKakaoLogin) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');
  const state = searchParams.get('state');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (state === 'goldhand') return; // Naver login state check

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
        if (isRejoinDialogOpen) return;
        // 쿠키 저장을 위해 server action 사용
        const postData = await kakaoLoginAction(code);

        // 재가입 가능한 탈퇴 유저가 로그인 했을 시
        if (postData.response === 'rejoin') {
          setRejoinUserData(postData.userData || undefined);
          setIsRejoinDialogOpen(true);
          return;
        }

        if (postData.response !== 'ok') {
          toastError(postData.message || '로그인에 실패했습니다.');
          return;
        }

        options?.onSuccess?.();

        if (postData.redirectTo) {
          startTransition(() => {
            router.replace(postData.redirectTo);
          });
        }
      } catch (error) {
        console.error(error);
        options?.onError?.(error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.');
        toastError('로그인 중 오류가 발생했습니다.');
      } finally {
        options?.onSettled?.();
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [code, error, router, error_description, state]);

  return { isLoading, isPending, isError: !!error, error_description };
};
