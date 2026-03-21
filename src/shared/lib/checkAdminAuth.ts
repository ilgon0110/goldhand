import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { IUserDetailData } from '@/src/shared/types';

type TAdminAuthResult =
  | { ok: false; reason: 'deleted_rejoin' | 'deleted' | 'expired' | 'invalid' | 'no_token' | 'not_found' }
  | { ok: true; uid: string; isAdmin: boolean };

export async function checkAdminAuth(): Promise<TAdminAuthResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    return { ok: false, reason: 'no_token' };
  }

  let uid: string;
  try {
    const decodedToken = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value);
    uid = decodedToken.uid;
  } catch (error) {
    if (error != null && typeof error === 'object' && 'code' in error && error.code === 'auth/id-token-expired') {
      return { ok: false, reason: 'expired' };
    }
    return { ok: false, reason: 'invalid' };
  }

  const adminDB = getAdminFirestore(firebaseAdminApp);
  const userSnapshot = await adminDB.collection('users').doc(uid).get();

  if (!userSnapshot.exists) {
    return { ok: false, reason: 'not_found' };
  }

  const userData = userSnapshot.data() as IUserDetailData;
  if (userData.isDeleted) {
    const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
    if (userData.deletedAt && userData.deletedAt.seconds * 1000 > oneYearAgo) {
      return { ok: false, reason: 'deleted_rejoin' };
    }
    return { ok: false, reason: 'deleted' };
  }

  return { ok: true, uid, isAdmin: userData.grade === 'admin' };
}
