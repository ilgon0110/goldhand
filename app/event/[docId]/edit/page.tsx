'use client';

import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { EventEditPage } from '@/src/views/event';
import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

type TPageProps = {
  params: { docId: string };
  searchParams: { password: string };
};

export default function Page({ params }: TPageProps) {
  const { docId } = params;

  return (
    <Suspense fallback={<LoadingBar />}>
      <ImagesContext>
        <EventEditPage docId={docId} />
      </ImagesContext>
    </Suspense>
  );
}
