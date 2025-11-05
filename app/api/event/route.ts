import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { loadEventParams } from '@/src/shared/lib/nuqs/searchParams';
import type { IEventDetailData, IEventListResponseData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

export async function GET(request: Request) {
  const { page, status } = loadEventParams(request);

  try {
    const adminDB = getAdminFirestore(firebaseAdminApp); // Use admin firestore for server-side operations
    // 쿼리 베이스 설정
    const baseQuery = adminDB
      .collection('events')
      .where('status', 'in', status === 'ALL' ? ['ONGOING', 'ENDED', 'UPCOMING'] : [status])
      .orderBy('createdAt', 'desc');

    const eventsSnapshot = await baseQuery.get();
    const totalDataLength = eventsSnapshot.size;

    // 페이지네이션 계산
    const PAGE_SIZE = 10;
    const startAtIndex = (page - 1) * PAGE_SIZE;
    const paginatedSnapshot = await baseQuery.offset(startAtIndex).limit(PAGE_SIZE).get();

    const eventsListData: IEventDetailData[] = paginatedSnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: { seconds: doc.data().createdAt._seconds, nanoseconds: doc.data().createdAt._nanoseconds },
      updatedAt: { seconds: doc.data().updatedAt._seconds, nanoseconds: doc.data().updatedAt._nanoseconds },
    })) as IEventDetailData[];

    return typedJson<IEventListResponseData>(
      { response: 'ok', message: 'ok', eventData: eventsListData, totalDataLength },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error getting document:', error);
    const errorCode =
      typeof error === 'object' && error != null && 'code' in error && typeof error.code === 'string'
        ? error.code
        : 'unknown_error';
    return typedJson<IEventListResponseData>(
      {
        response: 'ng',
        message: errorCode,
        eventData: [],
        totalDataLength: 0,
      },
      { status: 500 },
    );
  }
}
