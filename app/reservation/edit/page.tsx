import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { GET as reservationDetailGET } from '@/app/api/reservation/detail/route';
import { routeGet } from '@/app/lib/routeGet';
import { reservationDetailQueryOptions } from '@/src/entities/reservation';
import MyGoogleCaptcha from '@/src/shared/ui/GoogleRecaptcha';

import { ReservationEditPage } from './ui/ReservationEditPage';

type TPageProps = {
  params: { slug: string };
  searchParams: Promise<{ docId: string | undefined }>;
};

export default async function Page({ searchParams }: TPageProps) {
  const docId = (await searchParams).docId || '';
  const queryClient = new QueryClient();

  const result = await queryClient.fetchQuery(reservationDetailQueryOptions(docId, routeGet(reservationDetailGET)));
  if (result.response !== 'ok') throw new Error(result.message);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyGoogleCaptcha>
        <ReservationEditPage docId={docId} />
      </MyGoogleCaptcha>
    </HydrationBoundary>
  );
}
