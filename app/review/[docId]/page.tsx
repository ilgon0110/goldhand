import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { getReviewDetailData } from '@/src/views/review';
import { ReviewDetailPage } from '@/src/views/review/form/ui/ReviewDetailPage';
import { getUserData } from '@/src/views/signup';

type TPageProps = {
  params: { docId: string };
  searchParams: { password: string };
};

export default async function Page({ params }: TPageProps) {
  const { docId } = params;
  const data = await getReviewDetailData({
    docId,
  });
  const userData = await getUserData();

  if (data.message === 'Error getting document') {
    throw new Error('Error getting document');
  }

  return (
    <Suspense fallback={<LoadingBar />}>
      <ReviewDetailPage data={data} docId={docId} userData={userData} />
    </Suspense>
  );
}
