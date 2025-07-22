'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { SignupPage } from '@/src/views/signup';

export default function Page() {
  const client = new QueryClient();
  return (
    <Suspense fallback={<LoadingBar />}>
      <QueryClientProvider client={client}>
        <SignupPage />
      </QueryClientProvider>
    </Suspense>
  );
}
