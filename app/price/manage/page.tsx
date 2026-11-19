import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { GET as priceGET } from '@/app/api/price/route';
import { routeGet } from '@/app/lib/routeGet';
import { makeQueryClient } from '@/src/app/providers/get-query-client';
import { priceQueryOptions } from '@/src/entities/price';
import { PricingForm } from '@/src/feature/price';
import { checkAdminAuth } from '@/src/shared/lib/server';

export const metadata = {
  title: '요금 관리',
  robots: { index: false, follow: false },
  alternates: { canonical: '/price/manage' },
};
export default async function Page() {
  const auth = await checkAdminAuth(true);
  if (!auth.ok || !auth.isAdmin) redirect('/login');
  const queryClient = makeQueryClient();
  // 조회 실패 시 빈 폼으로 덮어쓰지 않도록 렌더링하지 않고 에러를 던진다.
  await queryClient.fetchQuery(priceQueryOptions(routeGet(priceGET)));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PricingForm />
    </HydrationBoundary>
  );
}
