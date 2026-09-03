import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { typedJson } from '@/src/shared/utils';

import type { IReviewPost, IReviewResponseBody } from './lib';
import { saveReview } from './lib';

export async function createUserReview(body: IReviewPost, accessToken: string) {
  try {
    const { uid } = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken);
    const db = getAdminFirestore(firebaseAdminApp);
    const userDocSnap = await db.collection('users').doc(uid).get();
    const userData = userDocSnap.data();

    if (userData?.isDeleted) {
      return typedJson<IReviewResponseBody>(
        { response: 'ng', message: '탈퇴한 유저는 리뷰를 작성할 수 없습니다.', docId: '' },
        { status: 403 },
      );
    }

    const phoneNumber = userData?.phoneNumber ?? '';
    return saveReview(body, { userId: uid, phoneNumber, phoneHash: null });
  } catch (error) {
    if (error != null && typeof error === 'object' && 'code' in error && error.code === 'auth/id-token-expired') {
      return typedJson<IReviewResponseBody>({ response: 'ng', message: 'expired', docId: '' }, { status: 401 });
    }

    console.error('Error verifying token:', error);
    return typedJson<IReviewResponseBody>({ response: 'ng', message: 'Unauthorized', docId: '' }, { status: 401 });
  }
}
