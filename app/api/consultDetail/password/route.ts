import bcrypt from 'bcryptjs';
import { doc, getDoc, getFirestore, Timestamp } from 'firebase/firestore';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import type { IConsultDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: IConsultDetailData;
  reservationToken: string | null;
}

interface IConsultDetailRequestBody {
  docId: string;
  password: string | null;
}

const defaultData: IConsultDetailData = {
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

export async function POST(request: NextRequest) {
  const { docId, password } = (await request.json()) as IConsultDetailRequestBody;

  if (!docId) {
    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: 'docId is required',
        data: defaultData,
        reservationToken: null,
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
          reservationToken: null,
        },
        { status: 404 },
      );
    }

    const data = docSnap.data() as IConsultDetailData;

    // 비회원 - 비밀번호 검증
    if (data.userId == null) {
      if (password === null) {
        return typedJson<IResponseBody>(
          {
            response: 'unAuthorized',
            message: 'password is required',
            data: defaultData,
            reservationToken: null,
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
            reservationToken: null,
          },
          { status: 403 },
        );
      }
    }

    // 인증 토큰을 쿠키에 저장 - 클라이언트 서버 액션에서 저장할 예정
    const jwtToken = jwt.sign({ docId }, process.env.JWT_SECRET!, {
      expiresIn: '1minutes',
    });
    return typedJson<IResponseBody>(
      {
        response: 'ok',
        message: 'ok',
        data: { ...data },
        reservationToken: jwtToken,
      },
      { status: 200 },
    );
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
        reservationToken: null,
      },
      { status: 500 },
    );
  }
}
