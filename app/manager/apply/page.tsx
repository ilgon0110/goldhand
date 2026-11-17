import { GET as userGET } from '@/app/api/user/route';
import type { IUserResponseData } from '@/src/entities/user';
import { jsonOrThrow } from '@/src/shared/api/request';
import MyGoogleCaptcha from '@/src/shared/ui/GoogleRecaptcha';

import { ManagerApplyPage } from './ui/ManagerApplyPage';

export default async function Page() {
  const userData = await jsonOrThrow<IUserResponseData>(await userGET());
  return (
    <MyGoogleCaptcha>
      <ManagerApplyPage userData={userData.userData} />
    </MyGoogleCaptcha>
  );
}
