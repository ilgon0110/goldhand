'use client';

import type { FirestoreError, Timestamp } from 'firebase/firestore';
import { collection, getFirestore, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { firebaseApp } from '@/src/shared/config/firebase';
import { fetcher } from '@/src/shared/utils/fetcher.client';

type TCommentProps = {
  docId: string;
  collectionName: 'consults' | 'events' | 'managers' | 'reviews';
};

type TComment = {
  id: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  comment: string;
  isAuthorAdmin: boolean;
};

type TUseCommentsResult = {
  comments: TComment[] | null;
  loading: boolean;
  error: FirestoreError | null;
};

interface IAuthorGradesResponseBody {
  response: 'ng' | 'ok';
  message: string;
  adminUserIds: string[];
}

// 작성자의 admin 여부는 서버에서 판별한다 — users 문서(PII 포함)를 클라이언트로 직접 내려주지 않기 위함.
async function getAdminUserIdSet(userIds: string[]): Promise<Set<string>> {
  const uniqueUserIds = Array.from(new Set(userIds));
  if (uniqueUserIds.length === 0) {
    return new Set();
  }

  try {
    const response = await fetcher<IAuthorGradesResponseBody>('/api/comment/author-grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: uniqueUserIds }),
      cache: 'no-store',
    });
    return new Set(response.adminUserIds);
  } catch (error) {
    console.error('Error fetching author grades:', error);
    return new Set();
  }
}

export function useComments({ docId, collectionName }: TCommentProps): TUseCommentsResult {
  const [comments, setComments] = useState<TComment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | null>(null);
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    if (!docId) return;
    setLoading(true);
    const commentsRef = collection(db, collectionName, docId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const rawComments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Omit<TComment, 'isAuthorAdmin'>[];

        getAdminUserIdSet(rawComments.map(item => item.userId)).then(adminUserIds => {
          setComments(rawComments.map(item => ({ ...item, isAuthorAdmin: adminUserIds.has(item.userId) })));
          setLoading(false);
          setError(null);
        });
      },
      err => {
        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [docId]);

  return { comments, loading, error };
}
