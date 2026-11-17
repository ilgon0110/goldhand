// app/review/[docId]/edit/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { GET as reviewDetailGET } from '@/app/api/review/detail/route';
import { routeGet, throwNotFoundOn404 } from '@/app/lib/routeGet';
import { reviewDetailQueryOptions } from '@/src/entities/review';
import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

import { ReviewEditPage } from './ui/ReviewEditPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;
  const queryClient = new QueryClient();

  await queryClient.fetchQuery(reviewDetailQueryOptions(docId, routeGet(reviewDetailGET))).catch(throwNotFoundOn404);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ImagesContext>
        <ReviewEditPage docId={docId} />
      </ImagesContext>
    </HydrationBoundary>
  );
}
