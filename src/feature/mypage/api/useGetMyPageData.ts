import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { clientGet, jsonOrThrow, type TGet } from '@/src/shared/api/request';
import { myPageKeys } from '@/src/shared/config/queryKeys';

import type { IMyPageResponseData } from '../model/types';

export const myPageQueryOptions = (get: TGet = clientGet) =>
  queryOptions({
    queryKey: myPageKeys.all,
    queryFn: async () => jsonOrThrow<IMyPageResponseData>(await get('/api/mypage')),
  });

export const useGetMyPageData = () => useSuspenseQuery(myPageQueryOptions());
