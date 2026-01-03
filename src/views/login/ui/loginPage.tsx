'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { safeLocalStorage } from '@/src/shared/storage';
import type { IUserDetailData } from '@/src/shared/types';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { toastSuccess } from '@/src/shared/utils';

import { useKakaoLogin } from '../api/useKakaoLogin';
import { useNaverLogin } from '../api/useNaverLogin';
import { AuthLoginButton } from './_AuthLoginButton';
import { RejoinModal } from './RejoinModal';

export const LoginPage = () => {
  const router = useRouter();
  const [isRejoinDialogOpen, setIsRejoinDialogOpen] = useState(false);
  const [rejoinUserData, setRejoinUserData] = useState<IUserDetailData>();

  // 카카오 로그인
  const { isPending: isKakaoPending, isLoading: isKakaoLoading } = useKakaoLogin({
    isRejoinDialogOpen,
    setIsRejoinDialogOpen,
    rejoinUserData,
    setRejoinUserData,
    options: {
      onSuccess: () => {
        toastSuccess('로그인에 성공했습니다!');
        safeLocalStorage.set('last-login-tooltip', 'kakao');
      },
    },
  });

  // 네이버 로그인
  const { isPending: isNaverPending, isLoading: isNaverLoading } = useNaverLogin({
    isRejoinDialogOpen,
    setIsRejoinDialogOpen,
    rejoinUserData,
    setRejoinUserData,
    options: {
      onSuccess: () => {
        toastSuccess('로그인에 성공했습니다!');
        safeLocalStorage.set('last-login-tooltip', 'naver');
      },
    },
  });

  return (
    <div className="flex flex-col items-center">
      <SectionTitle title="고운황금손 로그인" />
      {isNaverLoading && <LoadingSpinnerOverlay text="로그인 중..." />}
      {(isNaverPending || isKakaoPending) && <LoadingSpinnerOverlay text="회원가입 유무 확인 중..." />}

      <div className={cn('mt-6 flex w-full flex-col justify-center gap-4', 'md:flex-row')}>
        <AuthLoginButton
          disabled={isKakaoLoading || isNaverLoading || isNaverPending || isKakaoPending}
          handleClick={() => {
            router.push(
              `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_CALLBACK_URL}&response_type=code`,
            );
          }}
          iconSrc="/icon/kakaotalk.png"
          provider="kakao"
          title="카카오로 로그인하기"
        />

        <AuthLoginButton
          disabled={isKakaoLoading || isNaverLoading || isNaverPending || isKakaoPending}
          handleClick={() => {
            router.push(
              `https://nid.naver.com/oauth2.0/authorize?client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_NAVER_CALLBACK_URL}&state=${process.env.NEXT_PUBLIC_STATE_STRING}`,
            );
          }}
          iconSrc="/icon/naver.png"
          provider="naver"
          title="네이버로 로그인하기"
        />
      </div>

      {/* 재가입 다이얼로그 */}
      <RejoinModal
        isRejoinDialogOpen={isRejoinDialogOpen}
        rejoinUserData={rejoinUserData}
        setIsRejoinDialogOpen={setIsRejoinDialogOpen}
        setRejoinUserData={setRejoinUserData}
      />
    </div>
  );
};
