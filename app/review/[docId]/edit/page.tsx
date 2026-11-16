// app/review/[docId]/edit/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { GET as reviewDetailGET } from '@/app/api/review/detail/route';
import { reviewDetailQueryOptions } from '@/src/entities/review';
import { routeGet, throwNotFoundOn404 } from '@/src/shared/lib/server/routeGet';
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
