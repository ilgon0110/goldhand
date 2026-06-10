import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getUserData } from '@/src/shared/api/getUserData';
import { userKeys } from '@/src/shared/config/queryKeys';
import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

import { ReviewFormPage } from './ui/ReviewFormPage';

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const result = await getUserData();
      if (result.userData == null) throw new Error('로그인이 필요합니다.');
      return result;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ImagesContext>
        <ReviewFormPage />
      </ImagesContext>
    </HydrationBoundary>
  );
}
