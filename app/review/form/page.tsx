import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { GET as userGET } from '@/app/api/user/route';
import { routeGet } from '@/app/lib/routeGet';
import { ImagesContext } from '@/src/entities/image/client';
import { userQueryOptions } from '@/src/entities/user';

import { ReviewFormPage } from './ui/ReviewFormPage';

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(userQueryOptions(routeGet(userGET)));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ImagesContext>
        <ReviewFormPage />
      </ImagesContext>
    </HydrationBoundary>
  );
}
