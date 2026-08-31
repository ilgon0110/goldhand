import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore, Timestamp } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { serializeAdminTimestamp } from '@/src/shared/lib/serializeAdminTimestamp';
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

    const db = getAdminFirestore(firebaseAdminApp);
    const snap = await db.collection('users').doc(uid).get();

    if (!snap.exists || !snap.data()!.isDeleted) {
      return typedJson<IResponseGetBody>(
        { response: 'ng', message: '탈퇴 유저 정보를 찾을 수 없습니다.', userData: null },
        { status: 404 },
      );
    }

    return typedJson<IResponseGetBody>(
      {
        response: 'ok',
        message: '탈퇴 유저 정보 확인',
        userData: {
          ...snap.data(),
          userId: uid,
          createdAt: serializeAdminTimestamp(snap.data()?.createdAt)!,
          updatedAt: serializeAdminTimestamp(snap.data()?.updatedAt)!,
          deletedAt: serializeAdminTimestamp(snap.data()?.deletedAt),
        } as IUserDetailData,
      },
      { status: 200 },
    );
  } catch {
    return typedJson<IResponseGetBody>(
      { response: 'ng', message: '인증에 실패했습니다.', userData: null },
      { status: 401 },
    );
  }
}

export async function POST() {
  const db = getAdminFirestore(firebaseAdminApp);

  // 클라이언트가 보낸 userId를 신뢰하지 않고, accessToken을 검증해 얻은 uid로만 본인 재가입을 허용한다.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  if (!accessToken?.value) {
    return typedJson<IResponsePostBody>({ response: 'ng', message: '로그인이 필요합니다.' }, { status: 401 });
  }

  let userId: string;
  try {
    userId = (await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value)).uid;
  } catch {
    return typedJson<IResponsePostBody>({ response: 'ng', message: '인증에 실패했습니다.' }, { status: 401 });
  }

  // 탈퇴한 유저정보 확인
  const userDocRef = db.collection('users').doc(userId);
  const docSnap = await userDocRef.get();
  const targetUserData = docSnap.data() as IUserDetailData | undefined;
  if (targetUserData?.isDeleted && targetUserData.userId === userId) {
    try {
      await userDocRef.update({
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
