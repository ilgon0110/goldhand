import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

import { HttpError, type TGet } from '@/src/shared/api/request';

// 서버 prefetch 전용. 자기 자신의 /api/*로 HTTP를 보내지 않고 같은 프로세스에서 Route Handler를 호출한다.
// 응답 JSON 모양·status가 클라이언트 fetch와 동일하고, 핸들러 안의 cookies()는 현재 요청의 쿠키를 그대로 읽는다.
// ponytail: 핸들러 로직을 server 함수로 추출하지 않고 GET을 재사용한다. 핸들러가 request.headers 등 searchParams 외 값을 읽게 되면 추출로 전환할 것.
export const routeGet =
  (handler: (request: NextRequest) => Promise<Response>): TGet =>
  path =>
    handler(new NextRequest(new URL(path, 'http://route.internal')));

// 상세 페이지 fetchQuery의 404를 Next notFound()로 바꾼다. queryFn은 에러만 던지고 notFound는 page에서만 처리한다.
export function throwNotFoundOn404(error: unknown): never {
  if (error instanceof HttpError && error.status === 404) {
    notFound();
  }

  throw error;
}
