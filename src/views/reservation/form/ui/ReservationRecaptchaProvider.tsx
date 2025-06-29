import type { IConsultResponseData, IUserResponseData } from '@/src/shared/types';
import MyGoogleCaptcha from '@/src/shared/ui/GoogleRecaptcha';

import { ReservationFormPage } from './ReservationFormPage';

export const ReservationRecaptchaProvider = ({
  userData,
  consultDetailData,
}: {
  userData: IUserResponseData;
  consultDetailData: IConsultResponseData;
}) => {
  return (
    <MyGoogleCaptcha>
      <ReservationFormPage consultDetailData={consultDetailData} userData={userData} />
    </MyGoogleCaptcha>
  );
};
