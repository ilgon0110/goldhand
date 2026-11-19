'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const REFRESH_FALLBACK_DELAY_MS = 4000;

// authReturn은 서버(OAuth 콜백)가 성공 리다이렉트에 붙여준 값이라 첫 렌더에서 바로 읽을 수 있다.
// 그래서 로그인/비밀번호 게이트 UI가 아예 그려지지 않고 곧바로 로딩 상태로 시작할 수 있다.
export function useAuthReturnRefresh() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthReturn = searchParams.get('authReturn') === '1';
  const [hasGivenUpOnRefresh, setHasGivenUpOnRefresh] = useState(false);

  const isWaitingForRefresh = isAuthReturn && !hasGivenUpOnRefresh;

  useEffect(() => {
    if (!isAuthReturn) return;

    // SameSite=Lax 세션 쿠키라도 클라이언트 라우팅 캐시가 남아있을 수 있어
    // 같은 출처에서 나가는 refresh를 한 번 강제로 돌려 스스로 복구한다.
    router.refresh();
    window.history.replaceState(null, '', window.location.pathname);
  }, [isAuthReturn, router]);

  // refresh 이후에도 게이트가 남아 있으면 로딩 상태에 갇히므로 복구 장치를 둔다.
  useEffect(() => {
    if (!isWaitingForRefresh) return;

    const timeoutId = setTimeout(() => setHasGivenUpOnRefresh(true), REFRESH_FALLBACK_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [isWaitingForRefresh]);

  return isWaitingForRefresh;
}
