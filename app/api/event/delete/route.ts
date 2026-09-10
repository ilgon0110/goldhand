import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { verifySessionCookie } from '@/src/shared/lib/server';
import type { IReviewDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IEventRequestBody {
  docId: string;
}

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json()) as IEventRequestBody;
  const { docId } = body;

  if (!docId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'docId is required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  // 요청 본문의 userId를 신뢰하지 않고, session 쿠키를 검증해 얻은 uid만 사용한다.
  try {
    if (session == null) {
      return typedJson<IResponseBody>({ response: 'ng', message: 'Unauthorized' }, { status: 401 });
    }

    const { uid } = await verifySessionCookie(session.value, true);

    const adminDB = getAdminFirestore(firebaseAdminApp);
    const eventDocRef = adminDB.collection('events').doc(docId);
    const eventDocSnap = await eventDocRef.get();

    if (!eventDocSnap.exists) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '해당 docId를 가진 게시글이 존재하지 않습니다.',
        },
        { status: 404 },
      );
    }
    const targetData = eventDocSnap.data() as IReviewDetailData;

    if (targetData.userId !== uid) {
      return typedJson<IResponseBody>({ response: 'ng', message: '게시글 삭제 권한이 없습니다.' }, { status: 403 });
    }

    await eventDocRef.delete();

    revalidatePath('/event');
    return typedJson<IResponseBody>(
      {
        response: 'ok',
        message: '이벤트가 정상적으로 삭제되었습니다.',
      },
      { status: 200 },
    );
  } catch (error) {
    if (error != null && typeof error === 'object' && 'code' in error && error.code === 'auth/session-cookie-expired') {
      return typedJson<IResponseBody>({ response: 'ng', message: 'expired' }, { status: 401 });
    }

    console.error('Error deleting event document:', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: '이벤트 삭제 중 서버 오류가 발생하였습니다.' },
      { status: 500 },
    );
  }
}
