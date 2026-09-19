import { type NextRequest, NextResponse } from 'next/server';

import { isSafeReservationRedirectPath } from '@/src/shared/lib/isSafeReservationRedirectPath';

import {
  createOAuthState,
  expireOAuthRedirectCookie,
  setOAuthRedirectCookie,
  setOAuthStateCookie,
} from '../../lib/oauthState';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  const state = createOAuthState();
  const authorizationUrl = new URL('https://kauth.kakao.com/oauth/authorize');
  authorizationUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!);
  authorizationUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_KAKAO_CALLBACK_URL!);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('state', state);

  const redirectTo = request.nextUrl.searchParams.get('redirect');

  let response = setOAuthStateCookie(NextResponse.redirect(authorizationUrl, 302), 'kakao', state);
  // 이전 로그인 시도에서 남은 쿠키가 다른 로그인에 소비되지 않도록 항상 설정하거나 만료시킨다.
  response = isSafeReservationRedirectPath(redirectTo)
    ? setOAuthRedirectCookie(response, 'kakao', redirectTo)
    : expireOAuthRedirectCookie(response, 'kakao');

  return response;
}
