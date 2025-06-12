import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, Timestamp } from 'firebase/firestore';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import type { CommentData, ReviewDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: ReviewDetailData;
}

const defaultData: ReviewDetailData = {
  htmlString: '',
  createdAt: Timestamp.now(),
  franchisee: '',
  name: '',
  title: '',
  updatedAt: Timestamp.now(),
  userId: null,
  comments: [] as CommentData[],
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

    const data = docSnap.data() as ReviewDetailData;

    const commentsRef = collection(db, 'reviews', docId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const commentSnapshot = await getDocs(q);
    const comments = commentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as CommentData[];

    const responseData: IResponseBody = {
      response: 'ok',
      message: 'ok',
      data: {
        ...data,
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
