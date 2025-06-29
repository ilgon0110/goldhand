import type { FirestoreDataConverter } from 'firebase/firestore';
import {
  collection,
  getCountFromServer,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAt,
  where,
} from 'firebase/firestore';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
//import { loadConsultParams } from '@/src/shared/searchParams';
import type { IConsultDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  message: string;
  consultData: IConsultDetailData[];
  totalDataLength: number;
}

export async function GET(request: NextRequest) {
  //const { page, hideSecret } = loadConsultParams(request);
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') == null ? 1 : parseInt(searchParams.get('page')!, 10);
  const hideSecret = searchParams.get('hideSecret');
  const PAGE_SIZE = 10;
  const preloadCount = 1;

  const totalToFetch = PAGE_SIZE * preloadCount;
  const startAtIndex = (page - 1) * PAGE_SIZE;
  try {
    const app = firebaseApp;
    const db = getFirestore(app);
    const consultDocRef = collection(db, 'consults').withConverter(consultConverter);

    // 쿼리 베이스 설정
    const baseQuery = query(
      consultDocRef,
      orderBy('createdAt', 'desc'),
      ...(hideSecret === 'true' ? [where('secret', '==', false)] : []),
    );

    // 먼저 전체 필터링된 데이터 수를 가져오기 (페이지네이션 계산용)
    const filteredSnap = await getDocs(baseQuery);
    const totalDataLength = (await getCountFromServer(consultDocRef)).data().count;
    let paginatedQuery = baseQuery;

    if (startAtIndex > 0) {
      const startAtDoc = filteredSnap.docs[startAtIndex];
      if (startAtDoc) {
        paginatedQuery = query(paginatedQuery, startAt(startAtDoc), limit(totalToFetch));
      } else {
        paginatedQuery = query(paginatedQuery, limit(totalToFetch));
      }
    } else {
      paginatedQuery = query(paginatedQuery, limit(totalToFetch));
    }

    const snapShot = await getDocs(paginatedQuery);
    const consults = snapShot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return typedJson<IResponseBody>({ message: 'ok', consultData: consults, totalDataLength }, { status: 200 });
  } catch (error: any) {
    console.error('Error getting document:', error);
    return typedJson<IResponseBody>(
      {
        message: 'Error getting document',
        consultData: [],
        totalDataLength: 0,
      },
      { status: 500 },
    );
  }
}

const consultConverter: FirestoreDataConverter<IConsultDetailData> = {
  toFirestore(data: IConsultDetailData) {
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      ...data,
    } as IConsultDetailData;
  },
};
