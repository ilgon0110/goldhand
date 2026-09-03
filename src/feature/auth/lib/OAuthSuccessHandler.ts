'use client';

import { useEffect } from 'react';

import { safeLocalStorage } from '@/src/shared/storage';
import { toastSuccess } from '@/src/shared/utils';

export function OAuthSuccessHandler() {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const kakaoSuccess = searchParams.get('kakao_success') === 'true';
    const naverSuccess = searchParams.get('naver_success') === 'true';
    if (!kakaoSuccess && !naverSuccess) return;

    toastSuccess('로그인에 성공했습니다!');
    safeLocalStorage.set('last-login-tooltip', kakaoSuccess ? 'kakao' : 'naver');
    window.history.replaceState(null, '', '/');
  }, []);

  return null;
}
