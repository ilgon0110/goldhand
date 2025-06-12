import bcrypt from 'bcryptjs';
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, Timestamp } from 'firebase/firestore';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import type { CommentData, ConsultDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: ConsultDetailData;
}

const defaultData: ConsultDetailData = {
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
  const password = searchParams.get('password');

  console.log('consultDetail docId', docId);
  console.log('consultDetail password', password);
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

    const data = docSnap.data() as ConsultDetailData;

    if (data.secret) {
      if (password === null || password === undefined) {
        return typedJson<IResponseBody>(
          {
            response: 'ng',
            message: '비밀번호가 필요합니다.',
            data: defaultData,
          },
          { status: 403 },
        );
      }

      const isMatch = await bcrypt.compare(password, data.password || '');
      if (!isMatch) {
        return typedJson<IResponseBody>(
          {
            response: 'ng',
            message: '비밀번호가 틀립니다.',
            data: defaultData,
          },
          { status: 403 },
        );
      }
    }

    const commentsRef = collection(db, 'consults', docId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const commentSnapshot = await getDocs(q);
    const comments = commentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as CommentData[];
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
