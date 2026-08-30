import { Timestamp } from 'firebase/firestore';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import type { NextRequest } from 'next/server';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { checkAdminAuth } from '@/src/shared/lib/checkAdminAuth';
import { serializeAdminTimestamp } from '@/src/shared/lib/serializeAdminTimestamp';
import type { ICommentData, IReviewDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
  data: IReviewDetailData;
}

const defaultData: IReviewDetailData = {
  thumbnail: null,
  htmlString: '',
  createdAt: Timestamp.now(),
  franchisee: '',
  isPinned: false,
  pinnedAt: null,
  name: '',
  title: '',
  updatedAt: Timestamp.now(),
  userId: null,
  phoneNumber: null,
  phoneHash: null,
  comments: [] as ICommentData[],
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const docId = searchParams.get('docId');

  if (!docId) {
    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: 'docId is required',
        data: defaultData,
      },
      { status: 400 },
    );
  }
  try {
    const db = getAdminFirestore(firebaseAdminApp);
    const reviewDocRef = db.collection('reviews').doc(docId);
    const docSnap = await reviewDocRef.get();

    if (!docSnap.exists) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: 'no such document',
          data: defaultData,
        },
        { status: 404 },
      );
    }

    const data = docSnap.data() as IReviewDetailData;

    const commentSnapshot = await reviewDocRef.collection('comments').orderBy('createdAt', 'desc').get();
    const comments = commentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: serializeAdminTimestamp(doc.data().createdAt)!,
      updatedAt: serializeAdminTimestamp(doc.data().updatedAt)!,
    })) as ICommentData[];

    // phoneHash는 관리자에게도 노출하지 않는다. phoneNumber는 관리자만 조회 가능(비회원 본인 확인용).
    const authResult = await checkAdminAuth();
    const isAdmin = authResult.ok && authResult.isAdmin;

    const responseData: IResponseBody = {
      response: 'ok',
      message: 'ok',
      data: {
        ...data,
        createdAt: serializeAdminTimestamp(data.createdAt)!,
        updatedAt: serializeAdminTimestamp(data.updatedAt)!,
        pinnedAt: serializeAdminTimestamp(data.pinnedAt),
        phoneNumber: isAdmin ? data.phoneNumber : null,
        phoneHash: null,
        comments,
      },
    };
    return typedJson<IResponseBody>(responseData, { status: 200 });
  } catch (error) {
    console.error('Error getting document:', error);
    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: 'Error getting document',
        data: defaultData,
      },
      { status: 500 },
    );
  }
}
