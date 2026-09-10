// 라우트 핸들러(서버 전용 컨텍스트)에서만 호출된다. 클라이언트 컴포넌트가 부르는 곳이 없으므로
// 'use server'(Server Action)를 붙이지 않는다 — 붙이면 Next.js가 공개 호출 가능한 엔드포인트로
// 등록해버려서, 원래 라우트 핸들러 뒤에서만 실행되던 이 함수가 외부에서 직접 호출 가능해진다.
import type { DecodedIdToken } from 'firebase-admin/auth';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';

export async function createSessionCookie(idToken: string, expiresInMs: number): Promise<string> {
  return getAdminAuth(firebaseAdminApp).createSessionCookie(idToken, { expiresIn: expiresInMs });
}

export async function verifySessionCookie(
  sessionCookieValue: string,
  checkRevoked = false,
): Promise<DecodedIdToken> {
  return getAdminAuth(firebaseAdminApp).verifySessionCookie(sessionCookieValue, checkRevoked);
}
