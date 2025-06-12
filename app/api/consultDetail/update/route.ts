import bcrypt from 'bcryptjs';
import { doc, getDoc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import type { ConsultDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IConsultPost {
  docId: string;
  userId: string;
  title: string;
  password: string | null;
  franchisee: string;
  content: string;
  location: string;
  secret: boolean;
  bornDate: Date | undefined;
  name: string;
  phoneNumber: string;
}

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as IConsultPost;
  const { docId, userId, title, name, password, secret, franchisee, phoneNumber, location, content, bornDate } = body;

  if (!docId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'docId is required' }, { status: 400 });
  }

  // Update logic here...
  try {
    const app = firebaseApp;
    const db = getFirestore(app);
    const consultDocRef = doc(db, 'consults', docId);
    const docSnap = await getDoc(consultDocRef);

    if (!docSnap.exists()) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '해당 docId를 가진 게시글이 존재하지 않습니다.',
        },
        { status: 404 },
      );
    }
    const targetData = docSnap.data() as ConsultDetailData;

    // 비회원인 경우
    if (targetData.userId === null) {
      if (password === null) {
        return typedJson<IResponseBody>({ response: 'ng', message: '비밀번호를 입력해주세요.' }, { status: 401 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(password, targetData.password || '');
      if (!isMatch) {
        return typedJson<IResponseBody>({ response: 'ng', message: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
      }

      // 비회원이면서 비밀번호가 일치하는 경우만 수정 가능
      await updateDoc(consultDocRef, {
        title,
        content,
        location,
        franchisee,
        secret,
        bornDate: bornDate === undefined ? null : bornDate,
        name,
        phoneNumber,
        password: hashedPassword,
        updatedAt: serverTimestamp(),
      });

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
      console.log('targetData.userId:', targetData.userId);
      console.log('userId:', userId);
      if (targetData.userId !== userId) {
        return typedJson<IResponseBody>({ response: 'ng', message: '게시글 수정 권한이 없습니다.' }, { status: 401 });
      }

      // 회원이면서 userId가 일치하는 경우만 수정 가능
      await updateDoc(consultDocRef, {
        title,
        content,
        location,
        franchisee,
        secret,
        bornDate: bornDate === undefined ? null : bornDate,
        name,
        phoneNumber,
        password: null,
        updatedAt: serverTimestamp(),
      });

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
