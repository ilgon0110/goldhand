import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getUserData } from '@/src/shared/api/getUserData';
import { userKeys } from '@/src/shared/config/queryKeys';
import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

import { ReviewFormPage } from './ui/ReviewFormPage';

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: userKeys.all,
    queryFn: getUserData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ImagesContext>
        <ReviewFormPage />
      </ImagesContext>
    </HydrationBoundary>
  );
}
