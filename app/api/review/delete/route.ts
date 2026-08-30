import type { DocumentReference } from 'firebase-admin/firestore';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { checkAdminAuth } from '@/src/shared/lib/checkAdminAuth';
import { hashPhoneNumber } from '@/src/shared/lib/hashPhoneNumber';
import { verifyPhoneIdToken } from '@/src/shared/lib/verifyPhoneIdToken';
import type { IReviewDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IReviewRequestBody {
  docId: string;
  phoneIdToken?: string;
}

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json()) as IReviewRequestBody;
  const { docId, phoneIdToken } = body;

  if (!docId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'docId is required' }, { status: 400 });
  }

  try {
    const db = getAdminFirestore(firebaseAdminApp);
    const reviewDocRef = db.collection('reviews').doc(docId);
    const docSnap = await reviewDocRef.get();

    if (!docSnap.exists) {
      return typedJson<IResponseBody>(
        { response: 'ng', message: '해당 docId를 가진 게시글이 존재하지 않습니다.' },
        { status: 404 },
      );
    }
    const targetData = docSnap.data() as IReviewDetailData;

    // 관리자 또는 회원(작성자 본인)
    const authResult = await checkAdminAuth();
    if (authResult.ok) {
      if (!authResult.isAdmin && authResult.uid !== targetData.userId) {
        return typedJson<IResponseBody>({ response: 'ng', message: '게시글 삭제 권한이 없습니다.' }, { status: 403 });
      }
      return deleteReviewDoc(reviewDocRef);
    }

    if (authResult.reason !== 'no_token') {
      const message = authResult.reason === 'expired' ? 'expired' : 'Unauthorized';
      return typedJson<IResponseBody>({ response: 'ng', message }, { status: 401 });
    }

    // 비회원(accessToken 없음) - 회원 글은 접근 불가
    if (targetData.userId !== null) {
      return typedJson<IResponseBody>({ response: 'ng', message: 'Unauthorized' }, { status: 401 });
    }

    if (!phoneIdToken) {
      return typedJson<IResponseBody>({ response: 'ng', message: '휴대폰 인증이 필요합니다.' }, { status: 401 });
    }

    const verifyResult = await verifyPhoneIdToken(phoneIdToken);
    if (!verifyResult.ok) {
      return typedJson<IResponseBody>({ response: 'ng', message: '휴대폰 인증에 실패했습니다.' }, { status: 401 });
    }

    if (hashPhoneNumber(verifyResult.phoneNumber) !== targetData.phoneHash) {
      return typedJson<IResponseBody>({ response: 'ng', message: '본인 확인에 실패했습니다.' }, { status: 403 });
    }

    return deleteReviewDoc(reviewDocRef);
  } catch (error) {
    console.error('Error deleting Document:', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: '후기 삭제 중 서버 오류가 발생하였습니다.' },
      { status: 500 },
    );
  }
}

async function deleteReviewDoc(reviewDocRef: DocumentReference): Promise<Response> {
  await reviewDocRef.delete();
  revalidatePath('/review');
  return typedJson<IResponseBody>({ response: 'ok', message: '후기가 정상적으로 삭제되었습니다.' }, { status: 200 });
}
