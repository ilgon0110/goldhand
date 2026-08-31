import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { isOwnedPhoneNumber } from '@/src/shared/lib/verifyPhoneNumberOwnership';
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
  const accessToken = cookieStore.get('accessToken');

  if (accessToken?.value === undefined) {
    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: '로그인 된 상태가 아닙니다.',
      },
      { status: 401 },
    );
  }

  const decodedToken = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value);
  const uid = decodedToken.uid;

  if (!uid)
    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: '토큰이 만료되었거나 정상 토큰이 아닙니다.',
      },
      { status: 401 },
    );

  // 탈퇴한 유저인지 확인
  const userDocRef = db.collection('users').doc(uid);
  const docSnap = await userDocRef.get();
  const targetUserData = docSnap.data() as IUserDetailData | undefined;
  if (targetUserData?.isDeleted) {
    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: '탈퇴한 유저입니다. 재가입 후 이용해주세요.',
      },
      { status: 403 },
    );
  }

  const { phoneNumber } = await req.json();

  if (phoneNumber) {
    const userRecord = await getAdminAuth(firebaseAdminApp).getUser(uid);
    if (!isOwnedPhoneNumber(phoneNumber, userRecord.phoneNumber)) {
      return typedJson<IResponsePostBody>(
        { response: 'ng', message: 'SMS 인증이 완료된 휴대폰번호와 일치하지 않습니다.' },
        { status: 403 },
      );
    }
  }

  // signup 시에는 uid가 반드시 존재해야 하므로, 여기서 uid를 확인하는 것은 의미가 없다.
  try {
    await userDocRef.update({
      phoneNumber: phoneNumber || targetUserData?.phoneNumber || '',
      updatedAt: new Date(),
    });

    return typedJson<IResponsePostBody>({ response: 'ok', message: '핸드폰인증 성공!' }, { status: 200 });
  } catch (error) {
    console.error('핸드폰인증 에러!! ', error);

    const errorCode =
      error != null && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
        ? error.code
        : 'unknown_error';
    return typedJson<IResponsePostBody>({ response: 'ng', message: errorCode }, { status: 500 });
  }
}
