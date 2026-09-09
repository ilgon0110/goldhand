import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getUserData } from './src/shared/api/getUserData';

// /manager/ 아래에서 로그인·admin 여부와 무관하게 공개되어야 하는 경로.
// (이 목록에 없는 /manager/* 는 전부 admin 전용 상세 페이지로 취급한다.)
const PUBLIC_MANAGER_PATHS = new Set(['/manager', '/manager/about', '/manager/apply', '/manager/work']);

function isProtectedManagerPath(pathname: string): boolean {
  return pathname.startsWith('/manager/') && !PUBLIC_MANAGER_PATHS.has(pathname) && pathname !== '/manager/list';
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  const redirectUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_LOCAL_API_URL;

  const requiresAdmin = url.pathname === '/manager/list' || isProtectedManagerPath(url.pathname);
  const requiresLogin = requiresAdmin || url.pathname === '/signup' || url.pathname.startsWith('/mypage');

  // session 쿠키가 아예 없으면 /api/user 호출을 건너뛰지만, 아래 라우팅 판단은 그대로 거친다
  // (여기서 바로 return하면 보호 경로를 게스트가 그대로 통과해버린다).
  const response = session == null ? null : await getUserData();
  const isLogin = response?.response === 'ok';

  if (!isLogin) {
    // 로그인하지 않은 상태에서 접근하면 안 되는 경로는 전부 로그인 페이지로 보낸다.
    // 이 middleware 체크는 페이지 컴포넌트의 자체 인증 체크(전역 에러 대신 redirect)를 대체하는
    // 게 아니라, 더 빠르고 확실한 1차 방어로 추가하는 것이다 — middleware가 우회당해도(예:
    // CVE-2025-29927 같은 프레임워크 취약점) 페이지·API 레벨 체크가 2차 방어선으로 남는다.
    if (requiresLogin) {
      return NextResponse.redirect(`${redirectUrl}/login`);
    }
  } else {
    // admin 전용 경로는 로그인 상태여도 admin 등급이 아니면 여전히 막는다.
    if (requiresAdmin && response.userData?.grade !== 'admin') {
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
    '/manager/:path*',
    '/mypage',
    '/mypage/:path*',
  ],
};
