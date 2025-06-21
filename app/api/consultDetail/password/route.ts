import bcrypt from 'bcryptjs';
import { doc, getDoc, getFirestore, Timestamp } from 'firebase/firestore';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import type { ConsultDetailData } from '@/src/shared/types';
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

  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');

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

    // 비회원 - 비밀번호 검증
    if (data.userId == null) {
      if (password === null) {
        return typedJson<IResponseBody>(
          {
            response: 'unAuthorized',
            message: 'password is required',
            data: defaultData,
          },
          { status: 400 },
        );
      }

      const isMatch = await bcrypt.compare(password, data.password || '');

      if (!isMatch) {
        return typedJson<IResponseBody>(
          {
            response: 'unAuthorized',
            message: '비밀번호가 틀립니다.',
            data: defaultData,
          },
          { status: 403 },
        );
      }
    }

    const responseData: IResponseBody = {
      response: 'ok',
      message: 'ok',
      data: { ...data },
    };
    return typedJson<IResponseBody>(responseData, { status: 200 });
  } catch (error) {
    console.error('Error getting document:', error);
    const errorCode =
      error != null && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
        ? error.code
        : 'unknown_error';
    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: errorCode,
        data: defaultData,
      },
      { status: 500 },
    );
  }
}
