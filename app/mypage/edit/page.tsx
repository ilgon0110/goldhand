import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { getMyPageData } from '@/src/entities/mypage';
import { myPageKeys } from '@/src/shared/config/queryKeys';

import { MyPageEditPage } from './ui/MyPageEditPage';

export default async function Page() {
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery({ queryKey: myPageKeys.all, queryFn: getMyPageData });
  } catch {
    // 세션이 없거나 만료된 경우 전역 에러 페이지 대신 로그인으로 보낸다.
    redirect('/login');
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyPageEditPage />
    </HydrationBoundary>
  );
}
