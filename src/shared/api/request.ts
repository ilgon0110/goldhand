// 쿼리 queryFn이 GET 요청을 보내는 방법. 클라이언트는 브라우저 fetch, 서버 prefetch는 Route Handler 직접 호출(routeGet)을 주입한다.
export type TGet = (path: string) => Promise<Response>;

// 상대경로라 동일 출처 쿠키가 자동으로 붙는다(apiUrl 절대경로는 localhost↔127.0.0.1처럼 출처가 달라지면 쿠키가 빠진다).
export const clientGet: TGet = path => fetch(path, { cache: 'no-store' });

export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

// okStatuses: 에러 status라도 body로 화면을 분기하는 API는 해당 status를 정상 응답으로 취급한다.
export async function jsonOrThrow<T>(res: Response, okStatuses: number[] = []): Promise<T> {
  // nginx 502 HTML·빈 body 등 JSON이 아닌 응답에서도 status를 잃지 않도록 파싱 실패는 null로 둔다.
  const body = await res.json().catch(() => null);

  if (!res.ok && !okStatuses.includes(res.status)) {
    throw new HttpError(body?.message || 'API 요청 실패', res.status);
  }

  return body as T;
}
