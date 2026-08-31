import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { hashPhoneNumber } from '@/src/shared/lib/hashPhoneNumber';
import { verifyPhoneIdToken } from '@/src/shared/lib/verifyPhoneIdToken';
import { typedJson } from '@/src/shared/utils';

type TVerifyOwnerRequest = {
  docId?: string;
  phoneIdToken?: string;
};

type TVerifyOwnerResponse = {
  response: 'ng' | 'ok';
  message: string;
};

const VERIFICATION_FAILED_MESSAGE = '본인 확인에 실패했습니다. 입력 정보를 확인해주세요.';

const verificationFailedResponse = (status = 403) =>
  typedJson<TVerifyOwnerResponse>({ response: 'ng', message: VERIFICATION_FAILED_MESSAGE }, { status });

export async function POST(req: Request) {
  const { docId, phoneIdToken } = (await req.json()) as TVerifyOwnerRequest;
  if (!docId || !phoneIdToken) {
    return verificationFailedResponse(400);
  }

  try {
    const db = getAdminFirestore(firebaseAdminApp);
    const [reviewSnap, verifyResult] = await Promise.all([
      db.collection('reviews').doc(docId).get(),
      verifyPhoneIdToken(phoneIdToken),
    ]);

    if (!reviewSnap.exists || !verifyResult.ok) {
      return verificationFailedResponse();
    }

    const review = reviewSnap.data();
    if (review?.userId !== null || !review.phoneHash) {
      return verificationFailedResponse();
    }

    if (hashPhoneNumber(verifyResult.phoneNumber) !== review.phoneHash) {
      return verificationFailedResponse();
    }

    return typedJson<TVerifyOwnerResponse>({ response: 'ok', message: '본인 확인이 완료되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('Error verifying guest review owner:', error);
    return verificationFailedResponse(500);
  }
}
