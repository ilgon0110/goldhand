'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import type { IUserDetailData } from '@/src/shared/types';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';
import { toastError } from '@/src/shared/utils';
import { fetcher } from '@/src/shared/utils/fetcher.client';

import { AuthLoginButton } from './ui/_AuthLoginButton';
import { RejoinModal } from './ui/RejoinModal';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kakaoError = searchParams.get('kakao_error');
  const naverError = searchParams.get('naver_error');
  const isRejoin = searchParams.get('rejoin') === 'true';

  const [loadingText, setLoadingText] = useState<string | null>(null);
  const [isRejoinDialogOpen, setIsRejoinDialogOpen] = useState(false);
  const [rejoinUserData, setRejoinUserData] = useState<IUserDetailData>();

  useEffect(() => {
    if (kakaoError) toastError(decodeURIComponent(kakaoError));
  }, [kakaoError]);

  useEffect(() => {
    if (naverError) toastError(decodeURIComponent(naverError));
  }, [naverError]);

  useEffect(() => {
    if (!isRejoin) return;

    const fetchRejoinData = async () => {
      setLoadingText('회원가입 유무 확인 중...');
      try {
        const { userData } = await fetcher<{ response: string; userData: IUserDetailData | null }>('/api/user/rejoin', {
          credentials: 'include',
        });
        if (!userData) return;
        setRejoinUserData(userData);
        setIsRejoinDialogOpen(true);
      } catch {
        toastError('재가입 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoadingText(null);
      }
    };

    fetchRejoinData();
  }, [isRejoin]);

  return (
    <div className="flex flex-col items-center">
      <SectionTitleHero label="고운황금손 로그인" />

      {loadingText && <LoadingSpinnerOverlay text={loadingText} />}

      <div className={cn('mt-6 flex w-full flex-col justify-center gap-4', 'md:flex-row')}>
        <AuthLoginButton
          disabled={!!loadingText}
          handleClick={() => {
            setLoadingText('로그인 중...');
            router.push(
              `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_CALLBACK_URL}&response_type=code`,
            );
          }}
          iconSrc="/icon/kakaotalk.png"
          provider="kakao"
          title="카카오로 로그인하기"
        />

        <AuthLoginButton
          disabled={!!loadingText}
          handleClick={() => {
            setLoadingText('로그인 중...');
            router.push(
              `https://nid.naver.com/oauth2.0/authorize?client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_NAVER_CALLBACK_URL}&state=${process.env.NEXT_PUBLIC_STATE_STRING}`,
            );
          }}
          iconSrc="/icon/naver.png"
          provider="naver"
          title="네이버로 로그인하기"
        />
      </div>

      <RejoinModal
        isRejoinDialogOpen={isRejoinDialogOpen}
        rejoinUserData={rejoinUserData}
        setIsRejoinDialogOpen={setIsRejoinDialogOpen}
        setRejoinUserData={setRejoinUserData}
      />
    </div>
  );
};

export default LoginPage;
