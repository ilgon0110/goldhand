import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getPriceData } from '@/src/entities/price';
import { PricePage } from '@/src/feature/price';
import { priceKeys } from '@/src/shared/config/queryKeys';
import { checkAdminAuth } from '@/src/shared/lib/server';

export default async function Page() {
  const queryClient = new QueryClient();
  // 요금은 Firestore가 유일한 출처라, 조회 실패 시 렌더링하지 않고 에러를 던져 error.tsx로 넘긴다.
  const [, auth] = await Promise.all([
    queryClient.fetchQuery({ queryKey: priceKeys.all, queryFn: getPriceData }),
    checkAdminAuth(),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PricePage isAdmin={auth.ok && auth.isAdmin} />
    </HydrationBoundary>
  );
}
