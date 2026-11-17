import type { Query, WhereFilterOp } from 'firebase-admin/firestore';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';

export interface IPinnedFirstResult<T> {
  pinnedItems: (T & { id: string })[];
  pageItems: (T & { id: string })[];
  pageableDataLength: number;
  totalDataLength: number;
}

export async function getPinnedFirstListAdmin<T>(
  collectionName: 'consults' | 'events' | 'reviews',
  extraWhere: [string, WhereFilterOp, unknown][],
  page: number,
  pageSize: number,
): Promise<IPinnedFirstResult<T>> {
  const adminDB = getAdminFirestore(firebaseAdminApp);
  let baseCollection: Query = adminDB.collection(collectionName);
  for (const [field, op, value] of extraWhere) {
    baseCollection = baseCollection.where(field, op, value);
  }

  const pinnedQuery = baseCollection.where('isPinned', '==', true).orderBy('pinnedAt', 'desc');
  const nonPinnedQuery = baseCollection.where('isPinned', '==', false).orderBy('createdAt', 'desc');
  const startAtIndex = (page - 1) * pageSize;

  const [pinnedSnap, nonPinnedCountSnap, pageSnap] = await Promise.all([
    pinnedQuery.get(),
    nonPinnedQuery.count().get(),
    nonPinnedQuery.offset(startAtIndex).limit(pageSize).get(),
  ]);

  const pinnedItems = pinnedSnap.docs.map(d => ({ id: d.id, ...d.data() })) as (T & { id: string })[];
  const pageableDataLength = nonPinnedCountSnap.data().count;
  const totalDataLength = pinnedSnap.size + pageableDataLength;
  const pageItems = pageSnap.docs.map(d => ({ id: d.id, ...d.data() })) as (T & { id: string })[];

  return { pinnedItems, pageItems, pageableDataLength, totalDataLength };
}
