import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { GET as myPageGET } from '@/app/api/mypage/route';
import { myPageQueryOptions } from '@/src/entities/mypage';
import { routeGet } from '@/src/shared/lib/server/routeGet';

import { MyPageEditPage } from './ui/MyPageEditPage';

export default async function Page() {
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery(myPageQueryOptions(routeGet(myPageGET)));
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
