import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { typedJson } from '@/src/shared/utils';

interface IMyPageUpdatePost {
  name: string;
  nickname: string;
  phoneNumber: string;
  email: string;
}

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as IMyPageUpdatePost;
  const { name, nickname, email } = body;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  if (!accessToken?.value) {
    return typedJson<IResponseBody>({ response: 'ng', message: '로그인이 필요합니다.' }, { status: 401 });
  }

  let userId: string;
  try {
    userId = (await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value)).uid;
  } catch {
    return typedJson<IResponseBody>({ response: 'ng', message: '인증에 실패했습니다.' }, { status: 401 });
  }

  try {
    const db = getAdminFirestore(firebaseAdminApp);
    const userDocRef = db.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();

    if (!userDocSnap.exists) {
      return typedJson<IResponseBody>(
        { response: 'ng', message: '사용자 정보가 존재하지 않습니다.' },
        { status: 403 },
      );
    }

    const userRecord = await getAdminAuth(firebaseAdminApp).getUser(userId);
    const providerIds = userRecord.providerData.map(provider => provider.providerId);
    const isLinked = providerIds.includes('password') && providerIds.includes('phone');

    const currentEmail = userDocSnap.data()?.email as string | undefined;
    if (!isLinked && email !== currentEmail) {
      return typedJson<IResponseBody>(
        { response: 'ng', message: '본인인증이 완료된 사용자만 이메일을 수정할 수 있습니다.' },
        { status: 403 },
      );
    }

    try {
      await userDocRef.update({
        ...userDocSnap.data(),
        name,
        nickname,
        email,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return typedJson<IResponseBody>(
        { response: 'ok', message: '사용자 정보가 업데이트되었습니다.' },
        { status: 200 },
      );
    } catch (error) {
      console.error('Error updating user data:', error);
      return typedJson<IResponseBody>(
        { response: 'ng', message: '사용자 정보를 업데이트하는 데 실패했습니다.' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: '사용자 정보를 가져오는 데 실패했습니다.' },
      { status: 500 },
    );
  }
}
