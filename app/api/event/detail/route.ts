import { Timestamp } from 'firebase/firestore';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import type { NextRequest } from 'next/server';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { ICommentData, IEventDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: IEventDetailData;
}

const defaultData: IEventDetailData = {
  id: '',
  thumbnail: null,
  htmlString: '',
  createdAt: Timestamp.now(),
  rowNumber: 0,
  name: '',
  title: '',
  updatedAt: Timestamp.now(),
  userId: null,
  status: 'ONGOING',
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
    const adminDB = getAdminFirestore(firebaseAdminApp);
    const eventDocRef = adminDB.collection('events').doc(docId);
    const eventDocSnap = await eventDocRef.get();

    if (!eventDocSnap.exists) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: 'no such document',
          data: defaultData,
        },
        { status: 404 },
      );
    }

    const data = eventDocSnap.data();

    const commentsRef = adminDB.collection('events').doc(docId).collection('comments').orderBy('createdAt', 'desc');
    const commentSnapshot = await commentsRef.get();
    const comments = commentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ICommentData[];

    const responseData: IResponseBody = {
      response: 'ok',
      message: 'ok',
      data: {
        ...data,
        createdAt: {
          seconds: data?.createdAt._seconds,
          nanoseconds: data?.createdAt._nanoseconds,
        },
        updatedAt: {
          seconds: data?.updatedAt._seconds,
          nanoseconds: data?.updatedAt._nanoseconds,
        },
        comments,
      } as IEventDetailData,
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
