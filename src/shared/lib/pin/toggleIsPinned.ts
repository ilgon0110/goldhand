import { doc, getFirestore, Timestamp, updateDoc } from 'firebase/firestore';
import { getFirestore as getAdminFirestore, Timestamp as AdminTimestamp } from 'firebase-admin/firestore';

import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';

export async function togglePinClient(
  collectionName: 'consults' | 'reviews',
  docId: string,
  isPinned: boolean,
): Promise<void> {
  const db = getFirestore(firebaseApp);
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    isPinned,
    pinnedAt: isPinned ? Timestamp.now() : null,
  });
}

export async function togglePinAdmin(collectionName: 'events', docId: string, isPinned: boolean): Promise<void> {
  const adminDB = getAdminFirestore(firebaseAdminApp);
  const docRef = adminDB.collection(collectionName).doc(docId);
  await docRef.update({
    isPinned,
    pinnedAt: isPinned ? AdminTimestamp.now() : null,
  });
}
