import { getUserLoginData } from '@/src/shared/api/getUserData';
import MyGoogleCaptcha from '@/src/shared/ui/GoogleRecaptcha';

import { ManagerApplyPage } from './ui/ManagerApplyPage';

export default async function Page() {
  const userData = await getUserLoginData();
  return (
    <MyGoogleCaptcha>
      <ManagerApplyPage userData={userData.userData} />
    </MyGoogleCaptcha>
  );
}
