'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { LoginPage } from '@/src/views/login';

const client = new QueryClient();

export default function Page() {
  //const loginData = await getLoginData('naver');

  return (
    <Suspense fallback={<LoadingBar />}>
      <QueryClientProvider client={client}>
        <LoginPage />
      </QueryClientProvider>
      {/* {loginData.message === 'unAuthorized' ? (
        <div className="flex flex-col items-center">
          <div>회원가입 인증 실패!</div>
        </div>
      ) : (
        <LoginPage />
      )} */}
    </Suspense>
  );
}
