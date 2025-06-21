import { deleteDoc, doc, getDoc, getFirestore } from 'firebase/firestore';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import type { ReviewDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IReviewRequestBody {
  docId: string;
  userId: string;
}

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json()) as IReviewRequestBody;
  const { docId, userId } = body;

  if (!docId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'docId is required' }, { status: 400 });
  }

  // Delete logic here...
  try {
    const app = firebaseApp;
    const db = getFirestore(app);
    const reviewDocRef = doc(db, 'reviews', docId);
    const docSnap = await getDoc(reviewDocRef);

    if (!docSnap.exists()) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '해당 docId를 가진 게시글이 존재하지 않습니다.',
        },
        { status: 404 },
      );
    }
    const targetData = docSnap.data() as ReviewDetailData;

    if (targetData.userId !== userId) {
      return typedJson<IResponseBody>(
        { response: 'unAuthorized', message: '게시글 삭제 권한이 없습니다.' },
        { status: 401 },
      );
    }

    // 회원이면서 userId가 일치하는 경우만 삭제 가능
    await deleteDoc(reviewDocRef);

    return typedJson<IResponseBody>(
      {
        response: 'ok',
        message: '후기가 정상적으로 삭제되었습니다.',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating Document:', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: '후기 삭제 중 서버 오류가 발생하였습니다.' },
      { status: 500 },
    );
  }
}
