import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { typedJson } from '@/src/shared/utils';

import type { IReviewPost, IReviewResponseBody } from './lib';
import { saveReview } from './lib';

// 호출부(route.ts)에서 세션 검증까지 마친 uid만 넘겨받는다 — 검증 실패는 이미 게스트 경로로 갈렸으므로 이 함수엔 없다.
export async function createUserReview(body: IReviewPost, uid: string) {
  try {
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
    console.error('Error creating user review:', error);
    return typedJson<IReviewResponseBody>(
      { response: 'ng', message: '리뷰 작성 중 오류가 발생했습니다.', docId: '' },
      { status: 500 },
    );
  }
}
