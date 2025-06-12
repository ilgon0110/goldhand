import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import type { UserDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IMyPageUpdatePost {
  uid: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  email: string;
}

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as IMyPageUpdatePost;
  const { uid, name, nickname, phoneNumber, email } = body;

  if (!uid) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'uid is required' }, { status: 400 });
  }

  // Update logic here...
  try {
    const app = firebaseApp;
    const auth = getAuth();
    const db = getFirestore(app);

    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      const userData = userDocSnap.data() as UserDetailData;
      console.log('User data:', userData);

      return typedJson<IResponseBody>(
        {
          response: 'unAuthorized',
          message: '사용자 정보가 존재하지 않습니다.',
        },
        { status: 403 },
      );
    }

    // Update user data
    try {
      await updateDoc(userDocRef, {
        name,
        nickname,
        phoneNumber,
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
        {
          response: 'ng',
          message: '사용자 정보를 업데이트하는 데 실패했습니다.',
        },
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
