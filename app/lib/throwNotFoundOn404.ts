import { notFound } from 'next/navigation';

import { HttpError } from '@/src/shared/api/request';

// 상세 페이지 fetchQuery의 404를 Next notFound()로 바꾼다. queryFn은 에러만 던지고 notFound는 page에서만 처리한다.
export function throwNotFoundOn404(error: unknown): never {
  if (error instanceof HttpError && error.status === 404) {
    notFound();
  }

  throw error;
}
