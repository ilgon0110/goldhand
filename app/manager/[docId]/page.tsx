import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { GET as userGET } from '@/app/api/user/route';
import type { IUserResponseData } from '@/src/entities/user';
import { userQueryOptions } from '@/src/entities/user';
import { jsonOrThrow } from '@/src/shared/api/request';

import { getManagerApplyDetailData } from './api';
import { ManagerApplyDetailPage } from './ui/ManagerApplyDetailPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;

  // 세션이 없거나 만료된 경우, 그리고 관리자가 아닌 경우 전역 에러 페이지 대신 로그인으로 보낸다.
  // 데이터 조회보다 먼저 검증해서, 인가 실패 시 상세 데이터를 아예 가져오지 않도록 한다.
  let userData: IUserResponseData;
  try {
    userData = await jsonOrThrow<IUserResponseData>(await userGET());
  } catch {
    redirect('/login');
  }

  if (userData.userData?.grade !== 'admin') {
    redirect('/login');
  }

  const data = await getManagerApplyDetailData({ docId });

  // 인가 확인에 쓴 user 응답을 user 쿼리 캐시에 넣어, 댓글 폼이 /api/user를 다시 호출하지 않게 한다.
  const queryClient = new QueryClient();
  queryClient.setQueryData(userQueryOptions().queryKey, userData);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ManagerApplyDetailPage managerApplyDetailData={data.data} userId={userData.userData.userId} />
    </HydrationBoundary>
  );
}
