'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { IUserDetailData } from '@/src/shared/types';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';

import { useKakaoLogin } from '../hooks/useKakaoLogin';
import { useNaverLogin } from '../hooks/useNaverLogin';
import { AuthLoginButton } from './AutoLoginButton';
import { RejoinModal } from './RejoinModal';

export const LoginPage = () => {
  const router = useRouter();
  const [isRejoinDialogOpen, setIsRejoinDialogOpen] = useState(false);
  const [rejoinUserData, setRejoinUserData] = useState<IUserDetailData>();

  // 카카오 로그인
  const { isLoading: isKakaoLoading, isPending: isKakaoPending } = useKakaoLogin({
    isRejoinDialogOpen,
    setIsRejoinDialogOpen,
    rejoinUserData,
    setRejoinUserData,
  });

  // 네이버 로그인
  const { isLoading: isNaverLoading, isPending: isNaverPending } = useNaverLogin({
    isRejoinDialogOpen,
    setIsRejoinDialogOpen,
    rejoinUserData,
    setRejoinUserData,
  });

  return (
    <div className="flex flex-col items-center">
      <SectionTitle buttonTitle="" title="고운황금손 로그인" onClickButtonTitle={() => {}} />
      {(isNaverLoading || isKakaoLoading) && <LoadingSpinnerOverlay text="로그인 중..." />}
      {(isNaverPending || isKakaoPending) && <LoadingSpinnerOverlay text="회원가입 유무 확인 중..." />}
      <div className="mt-14 flex w-full max-w-[480px] flex-col gap-4">
        <AuthLoginButton
          color="yellow"
          disabled={isNaverLoading || isKakaoLoading || isNaverPending || isKakaoPending}
          iconSrc="/icon/kakaotalk.png"
          title="카카오로 로그인하기"
          onClick={() => {
            router.push(
              `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_CALLBACK_URL}&response_type=code`,
            );
          }}
        />
        <AuthLoginButton
          color="green"
          disabled={isNaverLoading || isKakaoLoading || isNaverPending || isKakaoPending}
          iconSrc="/icon/naver.png"
          title="네이버로 로그인하기"
          onClick={() => {
            router.push(
              `https://nid.naver.com/oauth2.0/authorize?client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_NAVER_CALLBACK_URL}&state=${process.env.NEXT_PUBLIC_STATE_STRING}`,
            );
          }}
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
