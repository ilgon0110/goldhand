import { GET as userGET } from '@/app/api/user/route';
import { ImagesContext } from '@/src/entities/image/client';
import type { IUserResponseData } from '@/src/entities/user';
import { jsonOrThrow } from '@/src/shared/api/request';

import { EventFormPage } from './ui/EventFormPage';

export default async function Page() {
  // 로그인 검사만 한다. ['user'] 캐시는 루트 layout이 채우므로 여기서 dehydrate하지 않는다
  // (안쪽 HydrationBoundary가 이미 있는 user 쿼리를 다시 넣으면 hydrate가 effect로 미뤄진다).
  const result = await jsonOrThrow<IUserResponseData>(await userGET());
  if (result.userData == null) throw new Error('로그인이 필요합니다.');

  return (
    <ImagesContext>
      <EventFormPage />
    </ImagesContext>
  );
}
