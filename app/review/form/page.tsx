'use client';

import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { ReviewFormPage } from '@/src/views/review';
import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

export default function Page() {
  //const userData: IUserData = await getUserData();
  //const reviewDetailData = await getReviewDetailData({
  //  docId: searchParams.docId || "",
  //});

  return (
    <Suspense fallback={<LoadingBar />}>
      <ImagesContext>
        <ReviewFormPage />
      </ImagesContext>
    </Suspense>
  );
}
