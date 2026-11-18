'use client';

import { Suspense } from 'react';

import { useGetViewCountData } from '../api/useGetViewCountData';

const ViewCountValue = ({ docId }: { docId: string }) => {
  const { data } = useGetViewCountData(docId);
  return <>{data.data?.totalViewCount ?? 0}</>;
};

// 본문은 먼저 그리고 조회수만 스트리밍으로 채운다(상세 page가 await 없이 prefetch).
export const ViewCount = ({ docId }: { docId: string }) => (
  <Suspense fallback={null}>
    <ViewCountValue docId={docId} />
  </Suspense>
);
