import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import type { IUserDetailData } from '@/src/shared/types';
import { toastError } from '@/src/shared/utils';

import { naverLoginAction } from '../api/naverLoginAction';

type TUserNaverLogin = {
  isRejoinDialogOpen: boolean;
  setIsRejoinDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rejoinUserData: IUserDetailData | undefined;
  setRejoinUserData: React.Dispatch<React.SetStateAction<IUserDetailData | undefined>>;
};

export const useNaverLogin = ({
  isRejoinDialogOpen,
  setIsRejoinDialogOpen,
  rejoinUserData,
  setRejoinUserData,
}: TUserNaverLogin) => {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const access_token = window.location.hash.split('=')[1]?.split('&')[0];

    if (access_token === undefined) return;
    setIsLoading(true);

    const fetchPost = async () => {
      try {
        if (isRejoinDialogOpen) return;

        // 쿠키 저장을 위해 server action 사용
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

        if (postData.redirectTo) {
          startTransition(() => {
            router.replace(postData.redirectTo!);
          });
        }
      } catch (error) {
        console.error(error);
        toastError('로그인에 실패했습니다. 다시 시도해주세요.\n' + (error instanceof Error ? error.message : ''));
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [params]);

  return {
    isLoading,
    isPending,
  };
};
