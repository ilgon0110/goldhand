import { authFetcher } from '@/src/shared/utils/fetcher.server';

interface IResponseGetBody {
  message: string;
  accessToken: string | null;
}

export async function getLoginData(auth: string) {
  const result = await authFetcher<IResponseGetBody>(`/api/auth/${auth}`);

  return result;
}
