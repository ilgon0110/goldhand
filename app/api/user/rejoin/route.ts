import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, Timestamp, updateDoc } from 'firebase/firestore';

import { firebaseApp } from '@/src/shared/config/firebase';
import type { IUserDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponsePostBody {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export async function GET() {}

export async function POST(req: Request) {
  const app = firebaseApp;
  const auth = getAuth();
  const db = getFirestore(app);

  auth.languageCode = 'ko';
  const { userId } = await req.json();

  if (!userId) {
    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: '유저 ID가 제공되지 않았습니다.',
      },
      { status: 200 },
    );
  }

  // 탈퇴한 유저정보 확인
  const userDocRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userDocRef);
  const targetUserData = docSnap.data() as IUserDetailData | undefined;
  if (targetUserData?.isDeleted && targetUserData.userId === userId) {
    try {
      await updateDoc(userDocRef, {
        ...targetUserData,
        isDeleted: false,
        updatedAt: Timestamp.now(),
      });

      return typedJson<IResponsePostBody>({ response: 'ok', message: '재가입 성공!' }, { status: 200 });
    } catch (error) {
      console.error('회원가입 에러!! ', error);

      const errorCode =
        error != null && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
          ? error.code
          : 'unknown_error';
      return typedJson<IResponsePostBody>({ response: 'ng', message: errorCode }, { status: 500 });
    }
  } else {
    return typedJson<IResponsePostBody>(
      {
        response: 'unAuthorized',
        message: '재가입 가능 대상이 아닙니다. 재가입이 불가능합니다.',
      },
      { status: 200 },
    );
  }

  // signup 시에는 uid가 반드시 존재해야 하므로, 여기서 uid를 확인하는 것은 의미가 없다.
}
