import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { GET as priceGET } from '@/app/api/price/route';
import { routeGet } from '@/app/lib/routeGet';
import { makeQueryClient } from '@/src/app/providers/get-query-client';
import { priceQueryOptions } from '@/src/entities/price';
import { PricePage } from '@/src/feature/price';
import { checkAdminAuth } from '@/src/shared/lib/server';

export default async function Page() {
  const queryClient = makeQueryClient();
  // 요금은 Firestore가 유일한 출처라, 조회 실패 시 렌더링하지 않고 에러를 던져 error.tsx로 넘긴다.
  const [, auth] = await Promise.all([queryClient.fetchQuery(priceQueryOptions(routeGet(priceGET))), checkAdminAuth()]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PricePage isAdmin={auth.ok && auth.isAdmin} />
    </HydrationBoundary>
  );
}
