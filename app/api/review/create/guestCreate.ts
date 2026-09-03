import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { hashPhoneNumber } from '@/src/shared/lib/hashPhoneNumber';
import { verifyPhoneIdToken } from '@/src/shared/lib/verifyPhoneIdToken';
import { typedJson } from '@/src/shared/utils';

import type { IReviewPost, IReviewResponseBody } from './lib';
import { saveReview } from './lib';

const DUPLICATE_SUBMISSION_MESSAGE = '동일한 대리점에는 24시간 내 1회만 후기를 작성할 수 있습니다.';

export async function createGuestReview(body: IReviewPost) {
  const { franchisee, phoneIdToken } = body;

  if (!phoneIdToken) {
    return typedJson<IReviewResponseBody>(
      { response: 'ng', message: '휴대폰 인증이 필요합니다.', docId: '' },
      { status: 401 },
    );
  }

  const verifyResult = await verifyPhoneIdToken(phoneIdToken);
  if (!verifyResult.ok) {
    return typedJson<IReviewResponseBody>(
      { response: 'ng', message: '휴대폰 인증에 실패했습니다.', docId: '' },
      { status: 401 },
    );
  }

  const phoneHash = hashPhoneNumber(verifyResult.phoneNumber);
  const db = getAdminFirestore(firebaseAdminApp);
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const dedupSnap = await db
    .collection('reviews')
    .where('phoneHash', '==', phoneHash)
    .where('franchisee', '==', franchisee)
    .where('createdAt', '>=', twentyFourHoursAgo)
    .limit(1)
    .get();

  if (!dedupSnap.empty) {
    return typedJson<IReviewResponseBody>(
      { response: 'ng', message: DUPLICATE_SUBMISSION_MESSAGE, docId: '' },
      { status: 409 },
    );
  }

  return saveReview(body, {
    userId: null,
    phoneNumber: verifyResult.phoneNumber,
    phoneHash,
  });
}
