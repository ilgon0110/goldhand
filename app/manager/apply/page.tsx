import MyGoogleCaptcha from '@/src/shared/ui/GoogleRecaptcha';
import { ManagerApplyPage } from '@/src/views/manager';

export default function Page() {
  return (
    <MyGoogleCaptcha>
      <ManagerApplyPage />
    </MyGoogleCaptcha>
  );
}
