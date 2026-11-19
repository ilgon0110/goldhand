'use client';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

// error.tsx의 "새로고침"용. reset()만으로는 다시 렌더한 page의 useSuspenseQuery가 캐시에 남은 에러를 다시 던진다(재조회 안 함).
// 쿼리 에러 상태를 풀어 mount 시 재조회하게 하고, 서버 컴포넌트 에러도 복구되도록 router.refresh()를 함께 한다.
export const useErrorRetry = (reset: () => void) => {
  const router = useRouter();
  const { reset: resetQueryErrors } = useQueryErrorResetBoundary();
  return () => {
    resetQueryErrors();
    startTransition(() => {
      router.refresh();
      reset();
    });
  };
};
