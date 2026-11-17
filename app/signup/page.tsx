import { GET as userGET } from '@/app/api/user/route';
import type { IUserResponseData } from '@/src/entities/user';
import { jsonOrThrow } from '@/src/shared/api/request';

import { SignupPage } from './ui/SignupPage';

export default async function Page() {
  const data = await jsonOrThrow<IUserResponseData>(await userGET());
  return <SignupPage userData={data.userData} />;
}
