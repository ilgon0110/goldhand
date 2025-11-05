'use client';

import { Suspense } from 'react';

import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { EventFormPage } from '@/src/views/event';
import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinnerOverlay text="이벤트 작성 페이지 로딩중..." />}>
      <ImagesContext>
        <EventFormPage />
      </ImagesContext>
    </Suspense>
  );
}
