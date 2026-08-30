import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { applyReviewImageSrcs } from '@/src/shared/lib/applyReviewImageSrcs';
import { hashPhoneNumber } from '@/src/shared/lib/hashPhoneNumber';
import { verifyPhoneIdToken } from '@/src/shared/lib/verifyPhoneIdToken';
import { typedJson } from '@/src/shared/utils';

interface IReviewPost {
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

const DUPLICATE_SUBMISSION_MESSAGE = '동일한 대리점에는 24시간 내 1회만 후기를 작성할 수 있습니다.';

export async function POST(req: Request) {
  const body = (await req.json()) as IReviewPost;
  const { title, name, franchisee, htmlString } = body;
  if (!title || !htmlString || !name || !franchisee) {
    return typedJson<IResponseBody>(
      { response: 'ng', message: '필수로 입력해야하는 필드를 입력해주세요.', docId: '' },
      { status: 400 },
    );
  }

  // 회원인지 확인
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    return createGuestReviewPost(body);
  }

  try {
    const { uid } = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value);

    // 탈퇴한 유저인지 확인
    const db = getAdminFirestore(firebaseAdminApp);
    const userDocSnap = await db.collection('users').doc(uid).get();
    const targetUserData = userDocSnap.data();
    if (targetUserData?.isDeleted) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '탈퇴한 유저는 리뷰를 작성할 수 없습니다.',
          docId: '',
        },
        { status: 403 },
      );
    }

    return createReviewPost(uid, body);
  } catch (error) {
    if (error != null && typeof error === 'object' && 'code' in error && error.code === 'auth/id-token-expired') {
      return typedJson<IResponseBody>({ response: 'ng', message: 'expired', docId: '' }, { status: 401 });
    }

    console.error('Error verifying token:', error);
    return typedJson<IResponseBody>({ response: 'ng', message: 'Unauthorized', docId: '' }, { status: 401 });
  }
}

const createReviewPost = async (uid: string, body: IReviewPost) => {
  const { title, name, franchisee, htmlString, docId, images } = body;
  const { imageSrcAppliedHtmlString, thumbnailUrl } = applyReviewImageSrcs(htmlString, images);

  const db = getAdminFirestore(firebaseAdminApp);

  try {
    await db.collection('reviews').doc(docId).set({
      thumbnail: thumbnailUrl,
      title,
      name,
      franchisee,
      userId: uid,
      phoneNumber: null,
      phoneHash: null,
      htmlString: imageSrcAppliedHtmlString,
      isPinned: false,
      pinnedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath(`/review`);
    return typedJson<IResponseBody>(
      { response: 'ok', message: '리뷰가 성공적으로 작성되었습니다.', docId },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error creating review post:', error);
    return typedJson<IResponseBody>({ response: 'ng', message: '리뷰 작성에 실패했습니다.', docId }, { status: 500 });
  }
};

const createGuestReviewPost = async (body: IReviewPost) => {
  const { title, name, franchisee, htmlString, docId, images, phoneIdToken } = body;

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
    return typedJson<IResponseBody>(
      { response: 'ng', message: DUPLICATE_SUBMISSION_MESSAGE, docId: '' },
      { status: 409 },
    );
  }

  const { imageSrcAppliedHtmlString, thumbnailUrl } = applyReviewImageSrcs(htmlString, images);

  try {
    await db.collection('reviews').doc(docId).set({
      thumbnail: thumbnailUrl,
      title,
      name,
      franchisee,
      userId: null,
      phoneNumber: verifyResult.phoneNumber,
      phoneHash,
      htmlString: imageSrcAppliedHtmlString,
      isPinned: false,
      pinnedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath(`/review`);
    return typedJson<IResponseBody>(
      { response: 'ok', message: '리뷰가 성공적으로 작성되었습니다.', docId },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error creating guest review post:', error);
    return typedJson<IResponseBody>({ response: 'ng', message: '리뷰 작성에 실패했습니다.', docId }, { status: 500 });
  }
};
