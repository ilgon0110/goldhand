import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { typedJson } from '@/src/shared/utils';

interface IReviewPost {
  title: string;
  name: string;
  franchisee: string;
  htmlString: string;
  docId: string;
  images: { key: string; url: string }[] | null;
}

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  docId: string;
}

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

  try {
    if (!accessToken) {
      return typedJson<IResponseBody>({ response: 'ng', message: 'Unauthorized', docId: '' }, { status: 401 });
    }

    const { uid } = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken?.value);

    // 탈퇴한 유저인지 확인
    const db = getFirestore(firebaseApp);
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
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

    if (uid) {
      return createReviewPost(uid, body);
    }
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

  // htmlString 중 img 태그는 유지하면서 src의 속성만 제거
  const cleanedHtmlString = htmlString.replace(/<img\s+[^>]*src=["']data:image\/[^"']*["'][^>]*>/gi, match => {
    // src 속성을 ""로 바꾼 새로운 img 태그를 반환
    return match.replace(/src=["']data:image\/[^"']*["']/, 'src=""');
  });

  const imageSrcAppliedHtmlString = applyFireImageSrc(cleanedHtmlString, images || []);

  const app = firebaseApp;
  const db = getFirestore(app);

  try {
    await setDoc(doc(db, 'reviews', docId), {
      title,
      name,
      franchisee,
      userId: uid,
      htmlString: imageSrcAppliedHtmlString,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return typedJson<IResponseBody>(
      { response: 'ok', message: '리뷰가 성공적으로 작성되었습니다.', docId },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error creating review post:', error);
    return typedJson<IResponseBody>({ response: 'ng', message: '리뷰 작성에 실패했습니다.', docId }, { status: 500 });
  }
};

function applyFireImageSrc(html: string, fireImage: { key: string; url: string }[]) {
  return html.replace(/<img([^>]*?)id=["']([^"']+)["']([^>]*)>/gi, (match, beforeId, id, afterId) => {
    const image = fireImage.find(img => img.key === id);
    if (image && image.url) {
      // src 속성이 이미 있다면 교체
      if (/src=["'][^"']*["']/.test(match)) {
        return match.replace(/src=["'][^"']*["']/, `src="${image.url}"`);
      } else {
        // src 속성이 없으면 추가
        return `<img${beforeId} src="${image.url}" id="${id}"${afterId}>`;
      }
    }
    return match; // 매칭 안 되면 원본 유지
  });
}
