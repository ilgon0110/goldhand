'use client';

import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { LoginPage } from '@/src/views/login';

export default function Page() {
  return (
    <Suspense fallback={<LoadingBar />}>
      <LoginPage />
    </Suspense>
  );
}
