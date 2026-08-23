import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, Timestamp } from 'firebase/firestore';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import { checkAdminAuth } from '@/src/shared/lib/checkAdminAuth';
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
    const app = firebaseApp;
    const db = getFirestore(app);
    const reviewDocRef = doc(db, 'reviews', docId);
    const docSnap = await getDoc(reviewDocRef);

    if (!docSnap.exists()) {
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

    const commentsRef = collection(db, 'reviews', docId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const commentSnapshot = await getDocs(q);
    const comments = commentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ICommentData[];

    // phoneHash는 관리자에게도 노출하지 않는다. phoneNumber는 관리자만 조회 가능(비회원 본인 확인용).
    const authResult = await checkAdminAuth();
    const isAdmin = authResult.ok && authResult.isAdmin;

    const responseData: IResponseBody = {
      response: 'ok',
      message: 'ok',
      data: {
        ...data,
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
