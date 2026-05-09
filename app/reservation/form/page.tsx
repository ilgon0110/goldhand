import { getUserData } from '@/src/shared/api/getUserData';
import { ReservationRecaptchaProvider } from '@/src/views/reservation';

export default async function Page() {
  const userData = await getUserData();

  return <ReservationRecaptchaProvider userData={userData} />;
}
