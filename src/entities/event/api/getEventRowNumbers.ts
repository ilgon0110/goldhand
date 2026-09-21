import { FieldPath, getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';

/**
 * 현재 존재하는 모든 이벤트를 생성일 오름차순으로 정렬해 1부터 순번을 부여한다.
 * 생성 시간이 같은 문서는 문서 ID 순으로 정렬해 순번이 요청마다 바뀌지 않게 한다.
 */
export async function getEventRowNumberMap(): Promise<Map<string, number>> {
  const adminDB = getAdminFirestore(firebaseAdminApp);
  const snapshot = await adminDB
    .collection('events')
    .select('createdAt')
    .orderBy('createdAt', 'asc')
    .orderBy(FieldPath.documentId(), 'asc')
    .get();

  return new Map(snapshot.docs.map((doc, index) => [doc.id, index + 1]));
}
