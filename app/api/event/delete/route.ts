import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import type { NextRequest } from 'next/server';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { IReviewDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IEventRequestBody {
  docId: string;
  userId: string;
}

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json()) as IEventRequestBody;
  const { docId, userId } = body;

  if (!docId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'docId is required' }, { status: 400 });
  }

  // Delete logic here...
  try {
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

    if (targetData.userId !== userId) {
      return typedJson<IResponseBody>(
        { response: 'unAuthorized', message: '게시글 삭제 권한이 없습니다.' },
        { status: 401 },
      );
    }

    // 회원이면서 userId가 일치하는 경우만 삭제 가능
    await eventDocRef.delete();

    return typedJson<IResponseBody>(
      {
        response: 'ok',
        message: '이벤트가 정상적으로 삭제되었습니다.',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating Document:', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: '이벤트 삭제 중 서버 오류가 발생하였습니다.' },
      { status: 500 },
    );
  }
}
