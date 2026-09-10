// 라우트 핸들러에서만 호출되므로 Server Action(external 호출 가능 엔드포인트)으로 만들 필요가 없다.
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { verifySessionCookie } from '@/src/shared/lib/server';
import type { IUserDetailData } from '@/src/shared/types';

type TAdminAuthResult =
  | { ok: false; reason: 'deleted_rejoin' | 'deleted' | 'expired' | 'invalid' | 'no_token' | 'not_found' }
  | { ok: true; uid: string; isAdmin: boolean };

export async function checkAdminAuth(requireAdmin = false): Promise<TAdminAuthResult> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (session == null || session.value.trim() === '') {
    return { ok: false, reason: 'no_token' };
  }

  let uid: string;
  try {
    const decodedToken = await verifySessionCookie(session.value, requireAdmin);
    uid = decodedToken.uid;
  } catch (error) {
    if (error != null && typeof error === 'object' && 'code' in error && error.code === 'auth/session-cookie-expired') {
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

  const isAdmin = userData.grade === 'admin';

  // 일반 사용자 요청에는 Firebase Auth 백엔드 조회 비용을 부과하지 않는다. 다만 이 결과로
  // 관리자 권한을 부여할 때는 폐기·비활성화 상태까지 확인한다. 관리자 전용 API는 위의 최초
  // 검증에서 이미 확인했으므로 중복 호출하지 않는다.
  if (isAdmin && !requireAdmin) {
    try {
      await verifySessionCookie(session.value, true);
    } catch (error) {
      if (error != null && typeof error === 'object' && 'code' in error && error.code === 'auth/session-cookie-expired') {
        return { ok: false, reason: 'expired' };
      }
      return { ok: false, reason: 'invalid' };
    }
  }

  return { ok: true, uid, isAdmin };
}
