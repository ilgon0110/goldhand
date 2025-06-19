import { deleteDoc, doc, getDoc, getFirestore } from 'firebase/firestore';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import { typedJson } from '@/src/shared/utils';

interface ICommentPost {
  userId: string;
  docId: string;
  commentId: string;
  comment: string;
}

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json()) as ICommentPost;
  const { userId, docId, commentId } = body;

  if (!docId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'docId is required' }, { status: 400 });
  }

  if (!commentId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'commentId is required' }, { status: 400 });
  }

  // Delete logic here...
  try {
    const app = firebaseApp;
    const db = getFirestore(app);
    const commentDocRef = doc(db, 'consults', docId, 'comments', commentId);
    const commentDocSnap = await getDoc(commentDocRef);

    if (!commentDocSnap.exists()) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '해당 commentId를 가진 댓글이 존재하지 않습니다.',
        },
        { status: 404 },
      );
    }

    if (commentDocSnap.data().userId !== userId) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '해당 댓글을 삭제할 권한이 없습니다.',
        },
        { status: 403 },
      );
    }

    await deleteDoc(commentDocRef);

    return typedJson<IResponseBody>(
      {
        response: 'ok',
        message: '댓글이 삭제되었습니다.',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating Document:', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: '댓글 삭제 중 서버 오류가 발생하였습니다.' },
      { status: 500 },
    );
  }
}
