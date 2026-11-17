// app/review/[docId]/edit/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { GET as reviewDetailGET } from '@/app/api/review/detail/route';
import { routeGet } from '@/app/lib/routeGet';
import { throwNotFoundOn404 } from '@/app/lib/throwNotFoundOn404';
import { ImagesContext } from '@/src/entities/image';
import { reviewDetailQueryOptions } from '@/src/entities/review';

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
