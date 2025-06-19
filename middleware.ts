import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    const res = NextResponse.next();
    res.headers.set('accessToken', '');

    return res;
  }

  const apiUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? process.env.NEXT_PUBLIC_API_URL : 'http://127.0.0.1:3000';

  const response = await fetch(`${apiUrl}/api/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${accessToken.value}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    console.log('"middleware : response not ok"');
    const res = NextResponse.next();
    res.headers.set('accessTokens', '');

    if (url.pathname === '/signup') {
      return NextResponse.redirect('http://127.0.0.1:3000/login');
    }
    return res;
  }

  if (url.pathname === '/reservation/apply') {
    return NextResponse.redirect('http://127.0.0.1:3000/reservation/form');
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
