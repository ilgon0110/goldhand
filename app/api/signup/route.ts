import { getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
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
      { status: 401 },
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
      { status: 401 },
    );

  const { name, nickname, phoneNumber, email } = await req.json();
  try {
    await setDoc(doc(db, 'users', uid), {
      grade: 'basic',
      createdAt: new Date(),
      updatedAt: new Date(),
      name,
      nickname,
      email,
      phoneNumber,
      userId: uid,
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
