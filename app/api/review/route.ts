import type { FirestoreDataConverter } from 'firebase/firestore';
import { collection, documentId, getDocs, getFirestore, query, where } from 'firebase/firestore';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import { checkAdminAuth } from '@/src/shared/lib/checkAdminAuth';
import { getPinnedFirstListClient } from '@/src/shared/lib/pin/getPinnedFirstList';
import type { IReviewDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

// phoneHash는 관리자에게도 노출하지 않는다. phoneNumber는 관리자만 조회 가능(비회원 본인 확인용).
function maskGuestFields<T extends { phoneNumber: string | null; phoneHash: string | null }>(
  item: T,
  isAdmin: boolean,
): T {
  return {
    ...item,
    phoneNumber: isAdmin ? item.phoneNumber : null,
    phoneHash: null,
  };
}

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
  reviewData: (IReviewDetailData & { id: string; isAuthorAdmin: boolean })[];
  totalDataLength: number;
}

// Firestore `in` 쿼리는 값 30개까지만 허용하므로 청크로 나눠 조회한다.
async function getAdminUserIdSet(userIds: string[]): Promise<Set<string>> {
  const uniqueUserIds = Array.from(new Set(userIds));
  if (uniqueUserIds.length === 0) {
    return new Set();
  }

  const db = getFirestore(firebaseApp);
  const usersRef = collection(db, 'users');
  const CHUNK_SIZE = 30;
  const adminUserIds = new Set<string>();

  for (let i = 0; i < uniqueUserIds.length; i += CHUNK_SIZE) {
    const chunk = uniqueUserIds.slice(i, i + CHUNK_SIZE);
    const snap = await getDocs(query(usersRef, where(documentId(), 'in', chunk)));
    snap.docs.forEach(doc => {
      if (doc.data().grade === 'admin') {
        adminUserIds.add(doc.id);
      }
    });
  }

  return adminUserIds;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') == null ? 1 : parseInt(searchParams.get('page')!, 10);
  const franchisee = searchParams.get('franchisee') ?? '전체';
  const PAGE_SIZE = 10;

  try {
    const authResult = await checkAdminAuth();
    const isAdmin = authResult.ok && authResult.isAdmin;

    const { pinnedItems, pageItems, totalDataLength } = await getPinnedFirstListClient<IReviewDetailData>(
      'reviews',
      converter,
      franchisee !== '전체' ? [where('franchisee', '==', franchisee)] : [],
      page,
      PAGE_SIZE,
    );

    const combined = [...pinnedItems, ...pageItems];
    const adminUserIds = await getAdminUserIdSet(
      combined.map(item => item.userId).filter((userId): userId is string => userId != null),
    );

    const reviewData = combined.map(item => ({
      ...maskGuestFields(item, isAdmin),
      isAuthorAdmin: item.userId != null && adminUserIds.has(item.userId),
    }));

    return typedJson<IResponseBody>({ response: 'ok', message: 'ok', reviewData, totalDataLength }, { status: 200 });
  } catch (error) {
    console.error('Error getting document:', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: 'Error getting document', reviewData: [], totalDataLength: 0 },
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
