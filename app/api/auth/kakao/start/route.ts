import { NextResponse } from 'next/server';

import { createOAuthState, setOAuthStateCookie } from '../../lib/oauthState';

export const dynamic = 'force-dynamic';

export function GET() {
  const state = createOAuthState();
  const authorizationUrl = new URL('https://kauth.kakao.com/oauth/authorize');
  authorizationUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!);
  authorizationUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_KAKAO_CALLBACK_URL!);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('state', state);

  return setOAuthStateCookie(NextResponse.redirect(authorizationUrl, 302), 'kakao', state);
}
