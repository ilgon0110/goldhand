import MyGoogleCaptcha from '@/src/shared/ui/GoogleRecaptcha';

import { ReservationFormPage } from './ui/ReservationFormPage';

// user는 루트 layout이 스트리밍한다(app/layout.tsx).
export default function Page() {
  return (
    <MyGoogleCaptcha>
      <ReservationFormPage />
    </MyGoogleCaptcha>
  );
}
