import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, Timestamp } from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { ICommentData, IReservationDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: IReservationDetailData;
}

const defaultData: IReservationDetailData = {
  bornDate: null,
  content: '',
  createdAt: Timestamp.now(),
  franchisee: '',
  location: '',
  name: '',
  password: null,
  phoneNumber: '',
  secret: false,
  title: '',
  updatedAt: Timestamp.now(),
  userId: null,
  comments: null,
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const docId = searchParams.get('docId');
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');
  const reservationToken = cookieStore.get('reservationToken');

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
    const consultDocRef = doc(db, 'consults', docId);
    const docSnap = await getDoc(consultDocRef);

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

    const data = docSnap.data() as IReservationDetailData;

    if (data.secret) {
      // 비밀글&비회원
      if (data.userId == null) {
        const decoded = jwt.verify(reservationToken?.value || '', process.env.JWT_SECRET!) as { docId: string } | null;
        if (reservationToken == null || decoded == null || decoded.docId !== docId) {
          return typedJson<IResponseBody>(
            {
              response: 'ng',
              message: '비밀글 인증에 실패하였습니다.',
              data: defaultData,
            },
            { status: 403 },
          );
        }
      }
      // 비밀글&회원
      else {
        const decodedToken = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken?.value || '');
        const uid = decodedToken.uid;
        if (uid !== data.userId) {
          return typedJson<IResponseBody>(
            {
              response: 'unAuthorized',
              message: '해당 사용자가 작성한 글이 아닙니다.',
              data: defaultData,
            },
            { status: 403 },
          );
        }
      }
    }

    const commentsRef = collection(db, 'consults', docId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const commentSnapshot = await getDocs(q);
    const comments = commentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ICommentData[];

    // 비밀번호가 맞거나 비밀글이 아닐 경우
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
