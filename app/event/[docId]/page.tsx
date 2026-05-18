import { getEventDetailData } from '@/src/entities/event';
import { getUserData } from '@/src/shared/api/getUserData';
import { getViewCountData } from '@/src/shared/api/getViewCountData';

import { EventDetailPage } from './ui/EventDetailPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
  searchParams: Promise<{ password: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;
  const data = await getEventDetailData({
    docId,
  });
  const userData = await getUserData();
  const viewCountData = await getViewCountData({ docId });

  if (data.message === 'Error getting document') {
    throw new Error('Error getting document');
  }

  return <EventDetailPage data={data} docId={docId} userData={userData} viewCountData={viewCountData} />;
}
