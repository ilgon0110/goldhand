import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
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
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (accessToken?.value === undefined) {
    return typedJson<IResponsePostBody>(
      {
        response: 'unAuthorized',
        message: '로그인 된 상태가 아닙니다.',
      },
      { status: 200 },
    );
  }

  const decodedToken = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value);
  const uid = decodedToken.uid;

  auth.languageCode = 'ko';

  if (!uid)
    return typedJson<IResponsePostBody>(
      {
        response: 'unAuthorized',
        message: '토큰이 만료되었거나 정상 토큰이 아닙니다.',
      },
      { status: 200 },
    );

  // 탈퇴한 유저인지 확인
  const userDocRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userDocRef);
  const targetUserData = docSnap.data() as IUserDetailData | undefined;
  if (targetUserData?.isDeleted) {
    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: '탈퇴한 유저입니다. 재가입 후 이용해주세요.',
      },
      { status: 200 },
    );
  }

  const { name, nickname, phoneNumber, email } = await req.json();

  // signup 시에는 uid가 반드시 존재해야 하므로, 여기서 uid를 확인하는 것은 의미가 없다.
  try {
    await updateDoc(userDocRef, {
      name: name || targetUserData?.name || '',
      nickname: nickname || targetUserData?.nickname || '',
      phoneNumber: phoneNumber || targetUserData?.phoneNumber || '',
      email: email || targetUserData?.email || '',
      updatedAt: new Date(),
    });

    return typedJson<IResponsePostBody>({ response: 'ok', message: '회원가입 성공!' }, { status: 200 });
  } catch (error) {
    console.error('회원가입 에러!! ', error);

    const errorCode =
      error != null && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
        ? error.code
        : 'unknown_error';
    return typedJson<IResponsePostBody>({ response: 'ng', message: errorCode }, { status: 500 });
  }
}
