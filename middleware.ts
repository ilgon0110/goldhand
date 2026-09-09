import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getUserData } from './src/shared/api/getUserData';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  const redirectUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_LOCAL_API_URL;

  // session 쿠키가 아예 없으면 /api/user 호출을 건너뛰지만, 아래 라우팅 판단은 그대로 거친다
  // (여기서 바로 return하면 /manager/list 같은 보호 경로를 게스트가 그대로 통과해버린다).
  const response = session == null ? null : await getUserData();
  const isLogin = response?.response === 'ok';

  if (!isLogin) {
    // 로그인하지 않은 상태에서 접근하면 안 되는 경로는 전부 로그인 페이지로 보낸다.
    if (url.pathname === '/signup' || url.pathname === '/manager/list') {
      return NextResponse.redirect(`${redirectUrl}/login`);
    }
  } else {
    // /manager/list는 로그인 상태여도 admin 등급이 아니면 여전히 막는다.
    if (url.pathname === '/manager/list' && response.userData?.grade !== 'admin') {
      return NextResponse.redirect(`${redirectUrl}/login`);
    }

    // 이미 로그인한 사용자가 로그인 페이지에 다시 들어오면 마이페이지로 보낸다.
    if (url.pathname === '/login') {
      return NextResponse.redirect(`${redirectUrl}/mypage`);
    }
  }

  // 로그인 여부와 무관하게 항상 적용되는 리다이렉트.
  if (url.pathname === '/reservation/apply') {
    return NextResponse.redirect(`${redirectUrl}/reservation/form`);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/login',
    '/login/:path*',
    '/signup',
    '/signup/:path*',
    '/reservation',
    '/reservation/:path*',
    '/manager/list',
  ],
};
