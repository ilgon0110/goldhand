import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { GET as userGET } from '@/app/api/user/route';
import { userQueryOptions } from '@/src/entities/user';
import { routeGet } from '@/src/shared/lib/server/routeGet';
import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

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
