'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { ReviewEditPage } from '@/src/views/review';
import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

type TPageProps = {
  params: { docId: string };
  searchParams: { password: string };
};

const client = new QueryClient();

export default function Page({ params }: TPageProps) {
  const { docId } = params;

  return (
    <Suspense fallback={<LoadingBar />}>
      <QueryClientProvider client={client}>
        <ImagesContext>
          <ReviewEditPage docId={docId} />
        </ImagesContext>
      </QueryClientProvider>
    </Suspense>
  );
}
