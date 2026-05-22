'use client';

import { getEventDetailData } from '@/src/entities/event';
import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

import { EventEditPage } from './ui/EventEditPage';

type TPageProps = {
  params: { docId: string };
  searchParams: { password: string };
};

export default async function Page({ params }: TPageProps) {
  const { docId } = params;
  const data = await getEventDetailData({
    docId,
  });

  return (
    <ImagesContext>
      <EventEditPage data={data} docId={docId} />
    </ImagesContext>
  );
}
