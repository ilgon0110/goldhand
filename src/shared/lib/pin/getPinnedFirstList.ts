import type { FirestoreDataConverter, QueryConstraint } from 'firebase/firestore';
import { collection, getCountFromServer, getDocs, getFirestore, limit, orderBy, query, startAt, where } from 'firebase/firestore';
import type { Query, WhereFilterOp } from 'firebase-admin/firestore';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';

export interface IPinnedFirstResult<T> {
  pinnedItems: (T & { id: string })[];
  pageItems: (T & { id: string })[];
  totalDataLength: number;
}

export async function getPinnedFirstListClient<T>(
  collectionName: 'consults' | 'reviews',
  converter: FirestoreDataConverter<T>,
  extraFilters: QueryConstraint[],
  page: number,
  pageSize: number,
): Promise<IPinnedFirstResult<T>> {
  const db = getFirestore(firebaseApp);
  const collectionRef = collection(db, collectionName).withConverter(converter);

  const pinnedQuery = query(collectionRef, where('isPinned', '==', true), orderBy('pinnedAt', 'desc'), ...extraFilters);
  const pinnedSnap = await getDocs(pinnedQuery);
  const pinnedItems = pinnedSnap.docs.map(d => ({ id: d.id, ...d.data() })) as (T & { id: string })[];

  const baseQuery = query(collectionRef, where('isPinned', '==', false), orderBy('createdAt', 'desc'), ...extraFilters);
  const totalDataLength = (await getCountFromServer(baseQuery)).data().count;

  const startAtIndex = (page - 1) * pageSize;
  let paginatedQuery = baseQuery;
  if (startAtIndex > 0) {
    const filteredSnap = await getDocs(baseQuery);
    const startAtDoc = filteredSnap.docs[startAtIndex];
    paginatedQuery = startAtDoc
      ? query(baseQuery, startAt(startAtDoc), limit(pageSize))
      : query(baseQuery, limit(pageSize));
  } else {
    paginatedQuery = query(baseQuery, limit(pageSize));
  }

  const pageSnap = await getDocs(paginatedQuery);
  const pageItems = pageSnap.docs.map(d => ({ id: d.id, ...d.data() })) as (T & { id: string })[];

  return { pinnedItems, pageItems, totalDataLength };
}

export async function getPinnedFirstListAdmin<T>(
  collectionName: 'events',
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
  const pinnedSnap = await pinnedQuery.get();
  const pinnedItems = pinnedSnap.docs.map(d => ({ id: d.id, ...d.data() })) as (T & { id: string })[];

  const nonPinnedQuery = baseCollection.where('isPinned', '==', false).orderBy('createdAt', 'desc');
  const totalDataLength = (await nonPinnedQuery.get()).size;

  const startAtIndex = (page - 1) * pageSize;
  const pageSnap = await nonPinnedQuery.offset(startAtIndex).limit(pageSize).get();
  const pageItems = pageSnap.docs.map(d => ({ id: d.id, ...d.data() })) as (T & { id: string })[];

  return { pinnedItems, pageItems, totalDataLength };
}
