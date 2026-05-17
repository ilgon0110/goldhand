'use server';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { ICommentData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface ICommentResponse {
  response: 'ng' | 'ok';
  message: string;
}

export async function createComment(
  firestoreCollection: string,
  docType: ICommentData['docType'],
  { docId, comment }: { docId: string; comment: string },
): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    return typedJson<ICommentResponse>({ response: 'ng', message: '로그인 후 사용해주세요.' }, { status: 401 });
  }

  try {
    const db = getFirestore(firebaseApp);
    const decodedToken = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value);
    const uid = decodedToken.uid;

    if (!uid) {
      return typedJson<ICommentResponse>({ response: 'ng', message: '로그인 후 사용해주세요.' }, { status: 403 });
    }

    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.data()?.isDeleted) {
      return typedJson<ICommentResponse>(
        { response: 'ng', message: '탈퇴한 유저는 댓글을 작성할 수 없습니다.' },
        { status: 403 },
      );
    }

    const commentRef = collection(db, firestoreCollection, docId, 'comments');
    await addDoc(commentRef, {
      comment,
      userId: uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      docId,
      docType,
    });

    return typedJson<ICommentResponse>({ response: 'ok', message: '댓글이 생성되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error(`Error creating comment in ${firestoreCollection}:`, error);
    if (error != null && typeof error === 'object' && 'code' in error && error.code === 'auth/id-token-expired') {
      return typedJson<ICommentResponse>({ response: 'ng', message: '토큰이 만료되었습니다.' }, { status: 401 });
    }
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

  try {
    const db = getFirestore(firebaseApp);
    const commentDocRef = doc(db, firestoreCollection, docId, 'comments', commentId);
    const commentDocSnap = await getDoc(commentDocRef);

    if (!commentDocSnap.exists()) {
      return typedJson<ICommentResponse>(
        { response: 'ng', message: '해당 commentId를 가진 댓글이 존재하지 않습니다.' },
        { status: 404 },
      );
    }

    const targetCommentData = commentDocSnap.data() as ICommentData;
    await updateDoc(commentDocRef, { ...targetCommentData, comment, updatedAt: serverTimestamp() });

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
  { userId, docId, commentId }: { userId: string; docId: string; commentId: string },
): Promise<Response> {
  if (!docId) {
    return typedJson<ICommentResponse>({ response: 'ng', message: 'docId is required' }, { status: 400 });
  }
  if (!commentId) {
    return typedJson<ICommentResponse>({ response: 'ng', message: 'commentId is required' }, { status: 400 });
  }

  try {
    const db = getFirestore(firebaseApp);
    const commentDocRef = doc(db, firestoreCollection, docId, 'comments', commentId);
    const commentDocSnap = await getDoc(commentDocRef);

    if (!commentDocSnap.exists()) {
      return typedJson<ICommentResponse>(
        { response: 'ng', message: '해당 commentId를 가진 댓글이 존재하지 않습니다.' },
        { status: 404 },
      );
    }

    if (commentDocSnap.data().userId !== userId) {
      return typedJson<ICommentResponse>(
        { response: 'ng', message: '해당 댓글을 삭제할 권한이 없습니다.' },
        { status: 403 },
      );
    }

    await deleteDoc(commentDocRef);
    return typedJson<ICommentResponse>({ response: 'ok', message: '댓글이 삭제되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting comment in ${firestoreCollection}:`, error);
    return typedJson<ICommentResponse>(
      { response: 'ng', message: '댓글 삭제 중 서버 오류가 발생하였습니다.' },
      { status: 500 },
    );
  }
}
