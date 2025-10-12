import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getUserData } from './src/shared/api/getUserData';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    const res = NextResponse.next();
    res.headers.set('accessToken', '');

    return res;
  }

  const response = await getUserData();

  const redirectUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_LOCAL_API_URL;

  if (response.response !== 'ok') {
    console.log('"middleware : response not ok"');
    const res = NextResponse.next();
    res.headers.set('accessTokens', '');

    if (url.pathname === '/signup') {
      return NextResponse.redirect(`${redirectUrl}/login`);
    }

    if (response) return res;
  }

  if (url.pathname === '/manager/list') {
    if (response.userData?.grade !== 'admin') {
      return NextResponse.redirect(`${redirectUrl}/login`);
    }
  }

  if (url.pathname === '/reservation/apply') {
    return NextResponse.redirect(`${redirectUrl}/reservation/form`);
  }

  if (url.pathname === '/login' && response.response === 'ok') {
    return NextResponse.redirect(`${redirectUrl}/mypage`);
  }

  const res = NextResponse.next();
  //res.headers.set("accessToken", newAccessToken);
  //cookieStore.set("refreshToken", newRefreshToken);

  return res;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/login', '/login/:path*', '/signup', '/signup/:path*', '/reservation', '/reservation/:path*'],
};
