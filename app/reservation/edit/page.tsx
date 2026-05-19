import { getReservationDetailData } from '@/src/entities/reservation';
import { getUserData } from '@/src/shared/api/getUserData';
import MyGoogleCaptcha from '@/src/shared/ui/GoogleRecaptcha';

import { ReservationEditPage } from './ui/ReservationEditPage';

type TPageProps = {
  params: { slug: string };
  searchParams: Promise<{ docId: string | undefined; password: string | undefined }>;
};

export default async function Page({ searchParams }: TPageProps) {
  const userData = await getUserData();
  const consultDetailData = await getReservationDetailData({
    docId: (await searchParams).docId || '',
  });

  if (consultDetailData.response !== 'ok') {
    throw new Error('예약 정보를 불러오는 중 오류가 발생하였습니다.');
  }

  return (
    <MyGoogleCaptcha>
      <ReservationEditPage consultDetailData={consultDetailData} userData={userData} />
    </MyGoogleCaptcha>
  );
}
