import { getReviewDetailData } from '@/src/entities/review';
import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

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

  return (
    <ImagesContext>
      <ReviewEditPage data={data} docId={docId} />
    </ImagesContext>
  );
}
