'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { type ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type TAsyncBoundaryProps = {
  children: ReactNode;
  pendingFallback: ReactNode;
  /** 없으면 기본 에러 UI(다시 시도 버튼)를 보여준다. */
  errorFallback?: ReactNode;
};

// 스트리밍되는 섹션용 경계. 이 섹션의 쿼리가 실패해도 페이지 전체가 아니라 이 섹션만 에러 UI로 바뀐다.
// QueryErrorResetBoundary가 함수 children을 받으므로 서버 page에서 바로 쓸 수 있게 클라이언트 래퍼로 둔다.
export const AsyncBoundary = ({ children, pendingFallback, errorFallback }: TAsyncBoundaryProps) => (
  <QueryErrorResetBoundary>
    {({ reset: handleReset }) => (
      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary: handleRetry }) =>
          errorFallback ?? (
            <div className="flex flex-col items-center gap-3 py-10 text-center text-sm text-stone-500">
              <p>정보를 불러오지 못했습니다.</p>
              <button
                className="rounded-full border border-stone-300 px-4 py-1.5 text-stone-700 hover:border-stone-900"
                type="button"
                onClick={handleRetry}
              >
                다시 시도
              </button>
            </div>
          )
        }
        onReset={handleReset}
      >
        <Suspense fallback={pendingFallback}>{children}</Suspense>
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
