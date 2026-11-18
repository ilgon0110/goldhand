import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { clientGet, jsonOrThrow, type TGet } from '@/src/shared/api/request';
import { userKeys } from '@/src/shared/config/queryKeys';

import type { IUserResponseData } from '../model/types';

export const userQueryOptions = (get: TGet = clientGet) =>
  queryOptions({
    queryKey: userKeys.all,
    queryFn: async () => jsonOrThrow<IUserResponseData>(await get('/api/user')),
  });

// 루트 layout이 await 없이 prefetch해 pending으로 스트리밍한다(app/layout.tsx). page·Header는 같은 ['user'] 하나를 구독한다.
// page 컴포넌트·제출 로직용. data가 항상 정의된다(비회원으로 잘못 제출되는 것 방지).
export const useUserSuspenseQuery = () => useSuspenseQuery(userQueryOptions());

// page 안의 공용 UI(card, comment form)용. 데이터가 없어도 undefined로 렌더한다.
export const useUserQuery = () => useQuery(userQueryOptions());
