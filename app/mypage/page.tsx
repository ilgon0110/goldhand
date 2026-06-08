import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getMyPageData } from '@/src/entities/mypage';
import { myPageKeys } from '@/src/shared/config/queryKeys';

import { MyPagePage } from './ui/MyPagePage';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: myPageKeys.all, queryFn: getMyPageData });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyPagePage />
    </HydrationBoundary>
  );
}
