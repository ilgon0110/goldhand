import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, Timestamp, updateDoc } from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { IUserDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseGetBody {
  response: 'ng' | 'ok';
  message: string;
  userData: IUserDetailData | null;
}

interface IResponsePostBody {
  response: 'ng' | 'ok';
  message: string;
}

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (accessToken == null || accessToken.value == null || accessToken.value === '') {
    return typedJson<IResponseGetBody>(
      { response: 'ng', message: '로그인 토큰이 존재하지 않습니다.', userData: null },
      { status: 401 },
    );
  }

  try {
    const adminApp = getAdminAuth(firebaseAdminApp);
    const { uid } = await adminApp.verifyIdToken(accessToken.value);

    const db = getFirestore(firebaseApp);
    const snap = await getDoc(doc(db, 'users', uid));

    if (!snap.exists() || !snap.data().isDeleted) {
      return typedJson<IResponseGetBody>(
        { response: 'ng', message: '탈퇴 유저 정보를 찾을 수 없습니다.', userData: null },
        { status: 404 },
      );
    }

    return typedJson<IResponseGetBody>(
      { response: 'ok', message: '탈퇴 유저 정보 확인', userData: { ...snap.data(), userId: uid } as IUserDetailData },
      { status: 200 },
    );
  } catch {
    return typedJson<IResponseGetBody>(
      { response: 'ng', message: '인증에 실패했습니다.', userData: null },
      { status: 401 },
    );
  }
}

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
      { status: 400 },
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
        response: 'ng',
        message: '재가입 가능 대상이 아닙니다. 재가입이 불가능합니다.',
      },
      { status: 403 },
    );
  }

  // signup 시에는 uid가 반드시 존재해야 하므로, 여기서 uid를 확인하는 것은 의미가 없다.
}
