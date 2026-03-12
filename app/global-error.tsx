'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-indigo-600">
              {error.digest ? `에러 코드: ${error.digest}` : '에러 코드가 없습니다.'}
            </p>
            <h1 className="mt-4 text-balance text-xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              예기치 못한 오류가 발생하였습니다.
            </h1>
            <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">{error.message}</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                className="shadow-xs rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => reset()}
              >
                다시 시도
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
