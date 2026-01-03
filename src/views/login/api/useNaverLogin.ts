import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

import type { IUserDetailData } from '@/src/shared/types';
import { toastError } from '@/src/shared/utils';

import { naverLoginAction } from './naverLoginAction';
import { naverLoginTokenAction } from './naverLoginTokenAction';

type TUserNaverLogin = {
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

export const useNaverLogin = ({
  isRejoinDialogOpen,
  setIsRejoinDialogOpen,
  setRejoinUserData,
  options,
}: TUserNaverLogin) => {
  const initTsRef = useRef<number>(performance.now());

  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');
  const state = searchParams.get('state');

  // 초기 렌더에서 code+state가 있으면 즉시 로딩 상태로 시작
  const [isLoading, setIsLoading] = useState<boolean>(!!(code && state === 'goldhand'));
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (state !== 'goldhand') return; // KaKao login state check

    if (error) {
      console.error('Naver login error:', error, error_description);
      setIsLoading(false);
      toastError(error_description || '네이버 로그인에 실패했습니다.');
      return;
    }

    if (!code) return;

    const fetchPost = async () => {
      try {
        if (isRejoinDialogOpen) return;
        setIsLoading(true);
        // 쿠키 저장을 위해 server action 사용
        const { access_token, error_description } = await naverLoginTokenAction(code);
        if (!access_token) {
          toastError(error_description || '네이버 로그인에 실패했습니다.');

          return;
        }
        const postData = await naverLoginAction(access_token);

        // 재가입 가능한 탈퇴 유저가 로그인 했을 시
        if (postData.response === 'rejoin') {
          setRejoinUserData(postData.userData || undefined);
          setIsRejoinDialogOpen(true);

          return;
        }

        if (postData.response !== 'ok') {
          toastError(postData.message || '로그인에 실패했습니다.');
        }

        options?.onSuccess?.();

        if (postData.redirectTo) {
          startTransition(() => {
            router.replace(postData.redirectTo!);
          });
        }
      } catch (error) {
        console.error(error);
        options?.onError?.(error instanceof Error ? error.message : '로그인에 실패했습니다.');
        toastError('로그인에 실패했습니다. 다시 시도해주세요.\n' + (error instanceof Error ? error.message : ''));
      } finally {
        options?.onSettled?.();
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [code, error, error_description, state]);

  return {
    isLoading,
    isPending,
  };
};
