import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getMyPageData } from '@/src/entities/mypage';
import { myPageKeys } from '@/src/shared/config/queryKeys';

import { MyPageEditPage } from './ui/MyPageEditPage';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.fetchQuery({ queryKey: myPageKeys.all, queryFn: getMyPageData });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyPageEditPage />
    </HydrationBoundary>
  );
}
