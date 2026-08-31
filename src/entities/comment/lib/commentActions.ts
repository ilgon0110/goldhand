'use server';

import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { ICommentData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface ICommentResponse {
  response: 'ng' | 'ok';
  message: string;
}

/**
 * 댓글 작성/수정/삭제는 요청 본문의 userId를 신뢰하지 않고 accessToken을 검증해 얻은 uid만
 * 사용한다 (댓글의 userId는 누구나 읽을 수 있는 공개 데이터라 그대로 신뢰하면 사칭이 가능하다).
 */
async function verifyCommentAuthor(): Promise<Response | { uid: string }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  if (!accessToken) {
    return typedJson<ICommentResponse>({ response: 'ng', message: '로그인 후 사용해주세요.' }, { status: 401 });
  }

  try {
    const decodedToken = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value);
    return { uid: decodedToken.uid };
  } catch (error) {
    if (error != null && typeof error === 'object' && 'code' in error && error.code === 'auth/id-token-expired') {
      return typedJson<ICommentResponse>({ response: 'ng', message: '토큰이 만료되었습니다.' }, { status: 401 });
    }
    return typedJson<ICommentResponse>({ response: 'ng', message: '로그인 후 사용해주세요.' }, { status: 401 });
  }
}

export async function createComment(
  firestoreCollection: string,
  docType: ICommentData['docType'],
  { docId, comment }: { docId: string; comment: string },
): Promise<Response> {
  const authResult = await verifyCommentAuthor();
  if (authResult instanceof Response) return authResult;
  const { uid } = authResult;

  try {
    const adminDb = getAdminFirestore(firebaseAdminApp);
    const userDocSnap = await adminDb.collection('users').doc(uid).get();
    if (userDocSnap.data()?.isDeleted) {
      return typedJson<ICommentResponse>(
        { response: 'ng', message: '탈퇴한 유저는 댓글을 작성할 수 없습니다.' },
        { status: 403 },
      );
    }

    await adminDb
      .collection(firestoreCollection)
      .doc(docId)
      .collection('comments')
      .add({
        comment,
        userId: uid,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        docId,
        docType,
      });

    return typedJson<ICommentResponse>({ response: 'ok', message: '댓글이 생성되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error(`Error creating comment in ${firestoreCollection}:`, error);
    return typedJson<ICommentResponse>({ response: 'ng', message: 'Error getting document' }, { status: 500 });
  }
}

export async function updateComment(
  firestoreCollection: string,
  { docId, commentId, comment }: { docId: string; commentId: string; comment: string },
): Promise<Response> {
  if (!docId) {
    return typedJson<ICommentResponse>({ response: 'ng', message: 'docId is required' }, { status: 400 });
  }
  if (!commentId) {
    return typedJson<ICommentResponse>({ response: 'ng', message: 'commentId is required' }, { status: 400 });
  }

  const authResult = await verifyCommentAuthor();
  if (authResult instanceof Response) return authResult;
  const { uid } = authResult;

  try {
    const adminDb = getAdminFirestore(firebaseAdminApp);
    const commentDocRef = adminDb.collection(firestoreCollection).doc(docId).collection('comments').doc(commentId);
    const commentDocSnap = await commentDocRef.get();

    if (!commentDocSnap.exists) {
      return typedJson<ICommentResponse>(
        { response: 'ng', message: '해당 commentId를 가진 댓글이 존재하지 않습니다.' },
        { status: 404 },
      );
    }

    if (commentDocSnap.data()?.userId !== uid) {
      return typedJson<ICommentResponse>(
        { response: 'ng', message: '해당 댓글을 수정할 권한이 없습니다.' },
        { status: 403 },
      );
    }

    await commentDocRef.update({ comment, updatedAt: FieldValue.serverTimestamp() });

    return typedJson<ICommentResponse>({ response: 'ok', message: '댓글 수정 성공' }, { status: 200 });
  } catch (error) {
    console.error(`Error updating comment in ${firestoreCollection}:`, error);
    return typedJson<ICommentResponse>(
      { response: 'ng', message: '댓글 수정 중 서버 오류가 발생하였습니다.' },
      { status: 500 },
    );
  }
}

export async function deleteComment(
  firestoreCollection: string,
  { docId, commentId }: { userId?: string; docId: string; commentId: string },
): Promise<Response> {
  if (!docId) {
    return typedJson<ICommentResponse>({ response: 'ng', message: 'docId is required' }, { status: 400 });
  }
  if (!commentId) {
    return typedJson<ICommentResponse>({ response: 'ng', message: 'commentId is required' }, { status: 400 });
  }

  const authResult = await verifyCommentAuthor();
  if (authResult instanceof Response) return authResult;
  const { uid } = authResult;

  try {
    const adminDb = getAdminFirestore(firebaseAdminApp);
    const commentDocRef = adminDb.collection(firestoreCollection).doc(docId).collection('comments').doc(commentId);
    const commentDocSnap = await commentDocRef.get();

    if (!commentDocSnap.exists) {
      return typedJson<ICommentResponse>(
        { response: 'ng', message: '해당 commentId를 가진 댓글이 존재하지 않습니다.' },
        { status: 404 },
      );
    }

    if (commentDocSnap.data()?.userId !== uid) {
      return typedJson<ICommentResponse>(
        { response: 'ng', message: '해당 댓글을 삭제할 권한이 없습니다.' },
        { status: 403 },
      );
    }

    await commentDocRef.delete();
    return typedJson<ICommentResponse>({ response: 'ok', message: '댓글이 삭제되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting comment in ${firestoreCollection}:`, error);
    return typedJson<ICommentResponse>(
      { response: 'ng', message: '댓글 삭제 중 서버 오류가 발생하였습니다.' },
      { status: 500 },
    );
  }
}
