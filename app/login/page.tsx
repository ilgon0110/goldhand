'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { LoginPage } from '@/src/views/login';

const client = new QueryClient();

export default function Page() {
  return (
    <Suspense fallback={<LoadingBar />}>
      <QueryClientProvider client={client}>
        <LoginPage />
      </QueryClientProvider>
    </Suspense>
  );
}
