import type { FirestoreError, Timestamp } from 'firebase/firestore';
import { collection, getFirestore, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { firebaseApp } from '@/src/shared/config/firebase';

type TCommentProps = {
  docId: string;
  collectionName: 'consults' | 'reviews';
};

type TComment = {
  id: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  comment: string;
};

type TUseCommentsResult = {
  comments: TComment[] | null;
  loading: boolean;
  error: FirestoreError | null;
};

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
        const updated = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as TComment[];

        setComments(updated);
        setLoading(false);
        setError(null);
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
