import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { GET as userGET } from '@/app/api/user/route';
import { routeGet } from '@/app/lib/routeGet';
import { userQueryOptions } from '@/src/entities/user';
import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

import { EventFormPage } from './ui/EventFormPage';

export default async function Page() {
  const queryClient = new QueryClient();

  const result = await queryClient.fetchQuery(userQueryOptions(routeGet(userGET)));
  if (result.userData == null) throw new Error('로그인이 필요합니다.');

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ImagesContext>
        <EventFormPage />
      </ImagesContext>
    </HydrationBoundary>
  );
}
