import { firebaseApp } from "@/src/shared/config/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  FirestoreError,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";

type CommentProps = {
  docId: string;
  collectionName: "consults" | "reviews";
};

type Comment = {
  id: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  comment: string;
};

type UseCommentsResult = {
  comments: Comment[] | null;
  loading: boolean;
  error: FirestoreError | null;
};

export function useComments({
  docId,
  collectionName,
}: CommentProps): UseCommentsResult {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | null>(null);
  const app = firebaseApp;
  const db = getFirestore(app);

  useEffect(() => {
    if (!docId) return;
    setLoading(true);
    const commentsRef = collection(db, collectionName, docId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const updated = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Comment[];

        setComments(updated);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docId]);

  return { comments, loading, error };
}
