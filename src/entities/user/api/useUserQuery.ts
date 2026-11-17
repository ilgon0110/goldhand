import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { clientGet, jsonOrThrow, type TGet } from '@/src/shared/api/request';
import { userKeys } from '@/src/shared/config/queryKeys';

import type { IUserResponseData } from '../model/types';

const fetchUser = async (get: TGet) => jsonOrThrow<IUserResponseData>(await get('/api/user'));

export const userQueryOptions = (get: TGet = clientGet) =>
  queryOptions({
    queryKey: userKeys.all,
    queryFn: () => fetchUser(get),
  });

// 상위 page가 userQueryOptions를 prefetch한 page 컴포넌트·제출 로직용. data가 항상 정의된다(비회원으로 잘못 제출되는 것 방지).
export const useUserSuspenseQuery = () => useSuspenseQuery(userQueryOptions());

// page 안의 공용 UI(card, comment form)용. 데이터가 없어도 undefined로 렌더한다.
export const useUserQuery = () => useQuery(userQueryOptions());

// layout의 Header 전용. Header는 page의 HydrationBoundary보다 먼저 렌더되므로 같은 key를 쓰면 빈 쿼리를 먼저 만들고,
// HydrationBoundary가 hydrate를 useEffect로 미뤄 page의 suspense 쿼리가 SSR에서 fetch하게 된다. 그래서 하위 key를 쓴다.
// ['user', 'header']라 invalidate/removeQueries({ queryKey: userKeys.all })에 prefix로 함께 걸린다.
// ponytail: 헤더는 페이지당 /api/user 1회를 클라이언트에서 따로 호출한다. 없애려면 #113(스트리밍)에서 layout prefetch를 pending dehydrate로.
export const useHeaderUserQuery = () =>
  useQuery({ queryKey: [...userKeys.all, 'header'], queryFn: () => fetchUser(clientGet) });
