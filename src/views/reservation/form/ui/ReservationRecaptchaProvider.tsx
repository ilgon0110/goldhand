import type { IConsultResponseData, IUserResponseData } from '@/src/shared/types';
import MyGoogleCaptcha from '@/src/shared/ui/GoogleRecaptcha';

import { ReservationEditPage } from './ReservationEditPage';
import { ReservationFormPage } from './ReservationFormPage';

export const ReservationRecaptchaProvider = ({
  userData,
  consultDetailData,
}: {
  userData: IUserResponseData;
  consultDetailData?: IConsultResponseData;
}) => {
  return (
    <MyGoogleCaptcha>
      {consultDetailData ? (
        <ReservationEditPage consultDetailData={consultDetailData} userData={userData} />
      ) : (
        <ReservationFormPage userData={userData} />
      )}
    </MyGoogleCaptcha>
  );
};
