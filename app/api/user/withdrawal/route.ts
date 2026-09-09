import { getFirestore as getAdminFirestore, Timestamp } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { verifySessionCookie } from '@/src/shared/lib/server';
import type { IUserDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponsePostBody {
  response: 'ng' | 'ok';
  message: string;
}

export async function GET() {}

export async function POST(req: Request) {
  const db = getAdminFirestore(firebaseAdminApp);
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (session == null || session.value === '') {
    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: '로그인 된 상태가 아닙니다.',
      },
      { status: 401 },
    );
  }

  let uid: string;
  try {
    uid = (await verifySessionCookie(session.value)).uid;
  } catch {
    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: '토큰이 만료되었거나 정상 토큰이 아닙니다.',
      },
      { status: 401 },
    );
  }

  // withdrawal 시에는 uid가 반드시 존재해야 하므로, 여기서 uid를 확인하는 것은 의미가 없다.
  const userDocRef = db.collection('users').doc(uid);
  const docSnap = await userDocRef.get();
  const targetUserData = docSnap.data() as IUserDetailData | undefined;

  try {
    await userDocRef.update({
      ...targetUserData,
      isDeleted: true,
      deletedAt: Timestamp.now(),
    });

    return typedJson<IResponsePostBody>({ response: 'ok', message: '회원탈퇴 성공!' }, { status: 200 });
  } catch (error) {
    console.error('회원탈퇴 에러!! ', error);

    const errorCode =
      error != null && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
        ? error.code
        : 'unknown_error';
    return typedJson<IResponsePostBody>({ response: 'ng', message: errorCode }, { status: 500 });
  }
}
