import { getUserData } from '@/src/shared/api/getUserData';
import MyGoogleCaptcha from '@/src/shared/ui/GoogleRecaptcha';

import { ReservationFormPage } from './ui/ReservationFormPage';

export default async function Page() {
  const userData = await getUserData();

  return (
    <MyGoogleCaptcha>
      <ReservationFormPage userData={userData} />
    </MyGoogleCaptcha>
  );
}
