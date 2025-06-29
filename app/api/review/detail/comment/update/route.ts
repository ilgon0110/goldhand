import { doc, getDoc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import type { ICommentData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface ICommentPost {
  docId: string;
  commentId: string;
  comment: string;
}

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ICommentPost;
  const { docId, commentId, comment } = body;

  if (!docId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'docId is required' }, { status: 400 });
  }

  if (!commentId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'commentId is required' }, { status: 400 });
  }

  // UPDATE Logic...
  try {
    const app = firebaseApp;
    const db = getFirestore(app);
    const commentDocRef = doc(db, 'reviews', docId, 'comments', commentId);
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

    const targetCommentData = commentDocSnap.data() as ICommentData;

    const updatedCommentData = {
      ...targetCommentData,
      comment,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(commentDocRef, updatedCommentData);
    return typedJson<IResponseBody>({ response: 'ok', message: '댓글 수정 성공' }, { status: 200 });
  } catch (error) {
    console.error('Error updating Document:', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: '댓글 수정 중 서버 오류가 발생하였습니다.' },
      { status: 500 },
    );
  }
}
