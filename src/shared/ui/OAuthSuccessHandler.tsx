'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { safeLocalStorage } from '@/src/shared/storage';
import { toastSuccess } from '@/src/shared/utils';

export function OAuthSuccessHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const kakaoSuccess = searchParams.get('kakao_success') === 'true';
    const naverSuccess = searchParams.get('naver_success') === 'true';
    if (!kakaoSuccess && !naverSuccess) return;

    toastSuccess('로그인에 성공했습니다!');
    safeLocalStorage.set('last-login-tooltip', kakaoSuccess ? 'kakao' : 'naver');
    router.replace('/');
  }, [searchParams, router]);

  return null;
}
