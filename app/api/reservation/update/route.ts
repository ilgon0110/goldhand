import { FieldValue, getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { verifyAndRotateGuestPassword } from '@/src/shared/lib/verifyAndRotateGuestPassword';
import type { IReservationDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

export interface IConsultPost {
  docId: string;
  userId?: string;
  title: string;
  password?: string;
  oldPassword?: string;
  franchisee: string;
  content: string;
  location: string;
  secret: boolean;
  bornDate?: Date;
  name: string;
  phoneNumber: string;
  recaptchaToken: string;
}

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as IConsultPost;
  const {
    docId,
    userId,
    title,
    name,
    password,
    oldPassword,
    secret,
    franchisee,
    phoneNumber,
    location,
    content,
    bornDate,
  } = body;
  if (!docId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'docId is required' }, { status: 400 });
  }

  // Update logic here...
  try {
    const db = getAdminFirestore(firebaseAdminApp);
    const consultDocRef = db.collection('consults').doc(docId);
    const docSnap = await consultDocRef.get();

    if (!docSnap.exists) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '해당 docId를 가진 게시글이 존재하지 않습니다.',
        },
        { status: 404 },
      );
    }
    const targetData = docSnap.data() as IReservationDetailData;

    // 비회원인 경우
    if (targetData.userId === null) {
      if (password === undefined || oldPassword === undefined) {
        return typedJson<IResponseBody>({ response: 'ng', message: '비밀번호를 입력해주세요.' }, { status: 401 });
      }

      const verifyResult = await verifyAndRotateGuestPassword(oldPassword, password, targetData.password);
      if (!verifyResult.ok) {
        return typedJson<IResponseBody>(
          { response: 'ng', message: '기존 비밀번호가 일치하지 않습니다.' },
          { status: 401 },
        );
      }

      await consultDocRef.update({
        title,
        content,
        location,
        franchisee,
        secret,
        bornDate: bornDate === undefined ? null : bornDate,
        name,
        phoneNumber,
        password: verifyResult.newHashedPassword,
        updatedAt: FieldValue.serverTimestamp(),
      });

      revalidatePath(`/reservation/list/${docId}`);
      return typedJson<IResponseBody>(
        {
          response: 'ok',
          message: '게시글이 정상적으로 수정되었습니다.',
        },
        { status: 200 },
      );
    }
    // 회원인 경우
    else {
      // 회원일 땐 userId로 비교
      if (targetData.userId !== userId) {
        return typedJson<IResponseBody>({ response: 'ng', message: '게시글 수정 권한이 없습니다.' }, { status: 401 });
      }

      // 회원이면서 userId가 일치하는 경우만 수정 가능
      await consultDocRef.update({
        title,
        content,
        location,
        franchisee,
        secret,
        bornDate: bornDate === undefined ? null : bornDate,
        name,
        phoneNumber,
        password: null,
        updatedAt: FieldValue.serverTimestamp(),
      });

      revalidatePath(`/reservation/list/${docId}`);
      return typedJson<IResponseBody>(
        {
          response: 'ok',
          message: '게시글이 정상적으로 수정되었습니다.',
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error('Error updating Document:', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: '게시글 수정 중 서버 오류가 발생하였습니다.' },
      { status: 500 },
    );
  }
}
