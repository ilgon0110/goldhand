import { doc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import { checkAdminAuth } from '@/src/shared/lib/checkAdminAuth';
import type { IKakaoAlarmSettings } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IKakaoAlarmUpdateBody {
  key: keyof IKakaoAlarmSettings;
  value: boolean;
}

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

const VALID_KEYS: (keyof IKakaoAlarmSettings)[] = [
  'alarmComment',
  'alarmNews',
  'alarmNewPost',
  'alarmEditPost',
  'alarmNewComment',
  'alarmEditComment',
];

export async function POST(req: NextRequest) {
  const authResult = await checkAdminAuth();

  if (!authResult.ok) {
    if (authResult.reason === 'no_token') {
      return typedJson<IResponseBody>({ response: 'ng', message: '로그인 토큰이 존재하지 않습니다.' }, { status: 403 });
    }
    if (authResult.reason === 'expired') {
      return typedJson<IResponseBody>({ response: 'ng', message: '로그인 토큰이 만료되었습니다.' }, { status: 401 });
    }
    return typedJson<IResponseBody>({ response: 'ng', message: '인증에 실패했습니다.' }, { status: 403 });
  }

  const { uid } = authResult;

  let body: IKakaoAlarmUpdateBody;
  try {
    body = (await req.json()) as IKakaoAlarmUpdateBody;
  } catch {
    return typedJson<IResponseBody>({ response: 'ng', message: '유효하지 않은 요청입니다.' }, { status: 400 });
  }

  const { key, value } = body;

  if (!VALID_KEYS.includes(key) || typeof value !== 'boolean') {
    return typedJson<IResponseBody>({ response: 'ng', message: '유효하지 않은 요청입니다.' }, { status: 400 });
  }

  try {
    const db = getFirestore(firebaseApp);
    const userDocRef = doc(db, 'users', uid);

    await updateDoc(userDocRef, {
      [`kakaoAlarmSettings.${key}`]: value,
      updatedAt: serverTimestamp(),
    });

    return typedJson<IResponseBody>({ response: 'ok', message: '알림 설정이 저장되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('Error updating kakao alarm settings:', error);
    return typedJson<IResponseBody>({ response: 'ng', message: '알림 설정 저장에 실패했습니다.' }, { status: 500 });
  }
}
