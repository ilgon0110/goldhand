import { authFetcher } from '@/app/utils';

interface IResponseGetBody {
  message: string;
  accessToken: string | null;
}

export async function getLoginData(auth: string) {
  // const apiUrl =
  //   process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? process.env.NEXT_PUBLIC_API_URL : 'http://127.0.0.1:3000';

  // const rawCookie = headers().get('cookie') || '';
  // const cookiesObj = parse(rawCookie);
  // const accessToken = cookiesObj['accessToken'];

  // const res: Response = await fetch(`${apiUrl}/api/auth/${auth}`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Cookie: `accessToken=${accessToken}`,
  //   },
  //   cache: 'no-store',
  // });

  // if (!res.ok) {
  //   throw new Error("데이터 fetch 실패!!");
  // }

  const result = await authFetcher<IResponseGetBody>(`/api/auth/${auth}`);

  return result;
}
