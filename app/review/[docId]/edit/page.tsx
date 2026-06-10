// app/review/[docId]/edit/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getReviewDetailData } from '@/src/entities/review';
import { reviewKeys } from '@/src/shared/config/queryKeys';
import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

import { ReviewEditPage } from './ui/ReviewEditPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: reviewKeys.detail(docId),
    queryFn: () => getReviewDetailData({ docId }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ImagesContext>
        <ReviewEditPage docId={docId} />
      </ImagesContext>
    </HydrationBoundary>
  );
}
