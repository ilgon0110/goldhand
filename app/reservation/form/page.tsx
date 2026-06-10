import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getUserData } from '@/src/shared/api/getUserData';
import { userKeys } from '@/src/shared/config/queryKeys';
import MyGoogleCaptcha from '@/src/shared/ui/GoogleRecaptcha';

import { ReservationFormPage } from './ui/ReservationFormPage';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: userKeys.all,
    queryFn: getUserData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyGoogleCaptcha>
        <ReservationFormPage />
      </MyGoogleCaptcha>
    </HydrationBoundary>
  );
}
