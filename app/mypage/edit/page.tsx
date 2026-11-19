import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { GET as myPageGET } from '@/app/api/mypage/route';
import { routeGet } from '@/app/lib/routeGet';
import { makeQueryClient } from '@/src/app/providers/get-query-client';
import { myPageQueryOptions } from '@/src/feature/mypage';

import { MyPageEditPage } from './ui/MyPageEditPage';

export default async function Page() {
  const queryClient = makeQueryClient();

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
