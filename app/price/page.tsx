import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { GET as priceGET } from '@/app/api/price/route';
import { priceQueryOptions } from '@/src/entities/price';
import { PricePage } from '@/src/feature/price';
import { checkAdminAuth } from '@/src/shared/lib/server';
import { routeGet } from '@/src/shared/lib/server/routeGet';

export default async function Page() {
  const queryClient = new QueryClient();
  // 요금은 Firestore가 유일한 출처라, 조회 실패 시 렌더링하지 않고 에러를 던져 error.tsx로 넘긴다.
  const [, auth] = await Promise.all([
    queryClient.fetchQuery(priceQueryOptions(routeGet(priceGET))),
    checkAdminAuth(),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PricePage isAdmin={auth.ok && auth.isAdmin} />
    </HydrationBoundary>
  );
}
