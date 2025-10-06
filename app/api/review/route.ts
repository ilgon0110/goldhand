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
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { IReviewDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
  reviewData: IReviewDetailData[];
  totalDataLength: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') == null ? 1 : parseInt(searchParams.get('page')!, 10);
  const franchisee = searchParams.get('franchisee') ?? '전체';
  const PAGE_SIZE = 10;
  const preloadCount = 1;

  const totalToFetch = PAGE_SIZE * preloadCount;
  const startAtIndex = (page - 1) * PAGE_SIZE;

  try {
    const app = firebaseApp;
    const adminApp = firebaseAdminApp;
    const db = getFirestore(app);
    //const adminDB = getAdminFirestore(adminApp); // Use admin firestore for server-side operations
    const reviewDocRef = collection(db, 'reviews').withConverter(converter);
    // 쿼리 베이스 설정
    const baseQuery = query(
      reviewDocRef,
      orderBy('createdAt', 'desc'),
      ...(franchisee !== '전체' ? [where('franchisee', '==', franchisee)] : []),
    );

    // 먼저 전체 필터링된 데이터 수를 가져오기 (페이지네이션 계산용)
    const filteredSnap = await getDocs(baseQuery);
    const totalDataLength = (await getCountFromServer(reviewDocRef)).data().count;
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
    const reviews = snapShot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return typedJson<IResponseBody>(
      { response: 'ok', message: 'ok', reviewData: reviews, totalDataLength },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error getting document:', error);
    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: 'Error getting document',
        reviewData: [],
        totalDataLength: 0,
      },
      { status: 500 },
    );
  }
}

const converter: FirestoreDataConverter<IReviewDetailData> = {
  toFirestore(data: IReviewDetailData) {
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      ...data,
    } as IReviewDetailData;
  },
};
