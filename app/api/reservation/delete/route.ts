import bcrypt from 'bcryptjs';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { IReservationDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IConsultPost {
  docId: string;
  password: string | null;
}

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json()) as IConsultPost;
  const { docId, password } = body;

  if (!docId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'docId is required' }, { status: 400 });
  }

  // Delete logic here...
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
      if (password === null) {
        return typedJson<IResponseBody>({ response: 'ng', message: '비밀번호를 입력해주세요.' }, { status: 401 });
      }

      // 비회원인 경우 비밀번호 검증
      const isMatch = await bcrypt.compare(password, targetData.password || '');
      if (!isMatch) {
        return typedJson<IResponseBody>(
          {
            response: 'ng',
            message: '비밀번호가 일치하지 않습니다.',
          },
          { status: 401 },
        );
      }

      // 비회원이면서 비밀번호가 일치하는 경우만 삭제 가능
      await consultDocRef.delete();

      revalidatePath('/reservation/list');
      return typedJson<IResponseBody>(
        {
          response: 'ok',
          message: '게시글이 정상적으로 삭제되었습니다.',
        },
        { status: 200 },
      );
    }
    // 회원인 경우
    else {
      // 회원일 땐 클라이언트가 보낸 값이 아니라, accessToken을 검증해 얻은 uid와 비교한다.
      const cookieStore = await cookies();
      const accessToken = cookieStore.get('accessToken');
      if (!accessToken?.value) {
        return typedJson<IResponseBody>({ response: 'ng', message: '로그인이 필요합니다.' }, { status: 401 });
      }

      let verifiedUid: string;
      try {
        verifiedUid = (await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value)).uid;
      } catch {
        return typedJson<IResponseBody>({ response: 'ng', message: '인증에 실패했습니다.' }, { status: 401 });
      }

      if (targetData.userId !== verifiedUid) {
        return typedJson<IResponseBody>({ response: 'ng', message: '게시글 삭제 권한이 없습니다.' }, { status: 403 });
      }

      // 회원이면서 인증된 본인인 경우만 삭제 가능
      await consultDocRef.delete();

      revalidatePath('/reservation/list');
      return typedJson<IResponseBody>(
        {
          response: 'ok',
          message: '게시글이 정상적으로 삭제되었습니다.',
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error('Error updating Document:', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: '게시글 삭제 중 서버 오류가 발생하였습니다.' },
      { status: 500 },
    );
  }
}
