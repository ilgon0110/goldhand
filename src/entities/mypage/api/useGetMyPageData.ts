import { useQuery } from '@tanstack/react-query';

import { myPageKeys } from '@/src/shared/config/queryKeys';
import type { IMyPageResponseData } from '@/src/shared/types';
import { authFetcher } from '@/src/shared/utils/fetcher.server';

export const getMyPageData = async (): Promise<IMyPageResponseData> => {
  const response = await authFetcher(`/api/mypage`);

  return response as IMyPageResponseData;
};

export const useGetMyPageData = () => {
  const res = useQuery({
    queryKey: myPageKeys.all,
    queryFn: getMyPageData,
  });

  return res;
};
