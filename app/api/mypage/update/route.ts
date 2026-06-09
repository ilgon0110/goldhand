import { doc, getDoc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { typedJson } from '@/src/shared/utils';

interface IMyPageUpdatePost {
  userId: string;
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
  const { userId, name, nickname, email } = body;

  if (!userId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'userId is required' }, { status: 400 });
  }

  try {
    const db = getFirestore(firebaseApp);
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
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
      await updateDoc(userDocRef, {
        ...userDocSnap.data(),
        name,
        nickname,
        email,
        updatedAt: serverTimestamp(),
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
