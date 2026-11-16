import { GET as userGET } from '@/app/api/user/route';
import { jsonOrThrow } from '@/src/shared/api/request';
import type { IUserResponseData } from '@/src/shared/types';

import { SignupPage } from './ui/SignupPage';

export default async function Page() {
  const data = await jsonOrThrow<IUserResponseData>(await userGET());
  return <SignupPage userData={data.userData} />;
}
