import { NextResponse } from 'next/server';

import { createOAuthState, setOAuthStateCookie } from '../../lib/oauthState';

export const dynamic = 'force-dynamic';

export function GET() {
  const state = createOAuthState();
  const authorizationUrl = new URL('https://nid.naver.com/oauth2.0/authorize');
  authorizationUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!);
  authorizationUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_NAVER_CALLBACK_URL!);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('state', state);

  return setOAuthStateCookie(NextResponse.redirect(authorizationUrl, 302), 'naver', state);
}
