import type { DocumentReference } from 'firebase-admin/firestore';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { applyReviewImageSrcs } from '@/src/shared/lib/applyReviewImageSrcs';
import { checkAdminAuth } from '@/src/shared/lib/checkAdminAuth';
import { hashPhoneNumber } from '@/src/shared/lib/hashPhoneNumber';
import { verifyPhoneIdToken } from '@/src/shared/lib/verifyPhoneIdToken';
import type { IReviewDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IReviewRequestBody {
  title: string;
  name: string;
  franchisee: string;
  htmlString: string;
  docId: string;
  images: { key: string; url: string }[] | null;
  phoneIdToken?: string;
}

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
  docId: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as IReviewRequestBody;
  const { docId, title, franchisee, htmlString, name, phoneIdToken } = body;

  if (!docId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'docId is required', docId: '' }, { status: 400 });
  }

  if (!title || !htmlString || !name || !franchisee) {
    return typedJson<IResponseBody>(
      { response: 'ng', message: '필수로 입력해야하는 필드를 입력해주세요.', docId: '' },
      { status: 400 },
    );
  }

  const db = getAdminFirestore(firebaseAdminApp);
  const reviewDocRef = db.collection('reviews').doc(docId);
  const docSnap = await reviewDocRef.get();

  if (!docSnap.exists) {
    return typedJson<IResponseBody>(
      { response: 'ng', message: '해당 docId를 가진 게시글이 존재하지 않습니다.', docId: '' },
      { status: 404 },
    );
  }

  const targetData = docSnap.data() as IReviewDetailData;

  // 관리자 또는 회원(작성자 본인)
  const authResult = await checkAdminAuth();
  if (authResult.ok) {
    if (!authResult.isAdmin && authResult.uid !== targetData.userId) {
      return typedJson<IResponseBody>(
        { response: 'ng', message: '후기 수정 권한이 없습니다.', docId: '' },
        { status: 403 },
      );
    }
    return updateReviewPost(reviewDocRef, body, targetData.thumbnail);
  }

  if (authResult.reason !== 'no_token') {
    const message = authResult.reason === 'expired' ? 'expired' : 'Unauthorized';
    return typedJson<IResponseBody>({ response: 'ng', message, docId: '' }, { status: 401 });
  }

  // 비회원(accessToken 없음) - 회원 글은 접근 불가
  if (targetData.userId !== null) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'Unauthorized', docId: '' }, { status: 401 });
  }

  if (!phoneIdToken) {
    return typedJson<IResponseBody>(
      { response: 'ng', message: '휴대폰 인증이 필요합니다.', docId: '' },
      { status: 401 },
    );
  }

  const verifyResult = await verifyPhoneIdToken(phoneIdToken);
  if (!verifyResult.ok) {
    return typedJson<IResponseBody>(
      { response: 'ng', message: '휴대폰 인증에 실패했습니다.', docId: '' },
      { status: 401 },
    );
  }

  if (hashPhoneNumber(verifyResult.phoneNumber) !== targetData.phoneHash) {
    return typedJson<IResponseBody>(
      { response: 'ng', message: '본인 확인에 실패했습니다.', docId: '' },
      { status: 403 },
    );
  }

  return updateReviewPost(reviewDocRef, body, targetData.thumbnail);
}

async function updateReviewPost(
  reviewDocRef: DocumentReference,
  body: IReviewRequestBody,
  previousThumbnail: string | null,
): Promise<Response> {
  const { title, name, franchisee, htmlString, docId, images } = body;
  const { imageSrcAppliedHtmlString, thumbnailUrl } = applyReviewImageSrcs(htmlString, images);

  try {
    await reviewDocRef.update({
      thumbnail: thumbnailUrl ?? previousThumbnail,
      title,
      name,
      franchisee,
      htmlString: imageSrcAppliedHtmlString,
      updatedAt: new Date(),
    });

    revalidatePath(`/review/${docId}`);
    return typedJson<IResponseBody>(
      { response: 'ok', message: '리뷰가 성공적으로 수정되었습니다.', docId },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating review post:', error);
    return typedJson<IResponseBody>({ response: 'ng', message: '리뷰 수정에 실패했습니다.', docId }, { status: 500 });
  }
}
