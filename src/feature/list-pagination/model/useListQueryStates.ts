'use client';

import { type SetValues, useQueryStates, type UseQueryStatesKeysMap } from 'nuqs';
import { useTransition } from 'react';

// 목록 페이지네이션·필터용 URL state. 데이터는 클라이언트(React Query)가 소유한다.
export const useListQueryStates = <T extends UseQueryStatesKeysMap>(keyMap: T) => {
  const [isPending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(keyMap, { clearOnDefault: false });

  const updateParams = (next: Parameters<SetValues<T>>[0]) =>
    startTransition(() => {
      void setParams(next);
    });

  return [params, updateParams, isPending] as const;
};
