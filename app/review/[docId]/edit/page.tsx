import { getReviewDetailData } from '@/src/entities/review';

import { ReviewEditPage } from './ui/ReviewEditPage';

type TPageProps = {
  params: { docId: string };
  searchParams: { password: string };
};

export default async function Page({ params }: TPageProps) {
  const { docId } = params;

  const data = await getReviewDetailData({
    docId,
  });

  return <ReviewEditPage data={data} docId={docId} />;
}
