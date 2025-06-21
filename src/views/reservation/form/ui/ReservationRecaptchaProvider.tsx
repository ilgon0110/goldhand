import type { IConsultDetailData, IUserData } from '@/src/shared/types';
import MyGoogleCaptcha from '@/src/shared/ui/GoogleRecaptcha';

import { ReservationFormPage } from './ReservationFormPage';

export const ReservationRecaptchaProvider = ({
  userData,
  consultDetailData,
}: {
  userData: IUserData;
  consultDetailData: IConsultDetailData;
}) => {
  return (
    <MyGoogleCaptcha>
      <ReservationFormPage consultDetailData={consultDetailData} userData={userData} />
    </MyGoogleCaptcha>
  );
};
