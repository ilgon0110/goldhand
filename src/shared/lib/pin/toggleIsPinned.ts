import { getFirestore as getAdminFirestore, Timestamp as AdminTimestamp } from 'firebase-admin/firestore';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';

export async function togglePinAdmin(
  collectionName: 'consults' | 'events' | 'reviews',
  docId: string,
  isPinned: boolean,
): Promise<void> {
  const adminDB = getAdminFirestore(firebaseAdminApp);
  const docRef = adminDB.collection(collectionName).doc(docId);
  await docRef.update({
    isPinned,
    pinnedAt: isPinned ? AdminTimestamp.now() : null,
  });
}
