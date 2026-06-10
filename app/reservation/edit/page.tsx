import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getReservationDetailData } from '@/src/entities/reservation';
import { getUserData } from '@/src/shared/api/getUserData';
import { reservationKeys, userKeys } from '@/src/shared/config/queryKeys';
import MyGoogleCaptcha from '@/src/shared/ui/GoogleRecaptcha';

import { ReservationEditPage } from './ui/ReservationEditPage';

type TPageProps = {
  params: { slug: string };
  searchParams: Promise<{ docId: string | undefined }>;
};

export default async function Page({ searchParams }: TPageProps) {
  const docId = (await searchParams).docId || '';
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: reservationKeys.detail(docId),
    queryFn: async () => {
      const result = await getReservationDetailData({ docId });
      if (result.response !== 'ok') throw new Error(result.message);
      return result;
    },
  });

  await queryClient.prefetchQuery({ queryKey: userKeys.all, queryFn: getUserData });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyGoogleCaptcha>
        <ReservationEditPage docId={docId} />
      </MyGoogleCaptcha>
    </HydrationBoundary>
  );
}
