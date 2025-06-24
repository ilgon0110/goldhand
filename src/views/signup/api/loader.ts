import { parse } from 'cookie';
import { headers } from 'next/headers';

export async function getSignUpData() {
  const apiUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_LOCAL_API_URL;

  const rawCookie = headers().get('cookie') || '';
  const cookiesObj = parse(rawCookie);
  const accessToken = cookiesObj['accessToken'];

  const res: Response = await fetch(`${apiUrl}/api/signup`, {
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${accessToken}`,
    },
    cache: 'no-store',
  });

  // if (!res.ok) {
  //   throw new Error("데이터 fetch 실패!!");
  // }

  return res.json();
}
