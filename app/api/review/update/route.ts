import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import type { ReviewDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IReviewRequestBody {
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
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as IReviewRequestBody;
  const { docId, title, franchisee, htmlString, name, images } = body;

  if (!docId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'docId is required' }, { status: 400 });
  }

  if (!title || !htmlString || !name || !franchisee) {
    return typedJson<IResponseBody>(
      { response: 'ng', message: '필수로 입력해야하는 필드를 입력해주세요.' },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  const app = firebaseApp;
  const db = getFirestore(app);
  const reviewDocRef = doc(db, 'reviews', docId);
  const docSnap = await getDoc(reviewDocRef);

  if (!docSnap.exists()) {
    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: '해당 docId를 가진 게시글이 존재하지 않습니다.',
      },
      { status: 404 },
    );
  }

  const targetData = docSnap.data() as ReviewDetailData;

  // 글 작성자 uid 확인
  try {
    if (!accessToken) {
      return typedJson<IResponseBody>({ response: 'ng', message: 'Unauthorized' }, { status: 401 });
    }

    const { uid } = await getAdminAuth().verifyIdToken(accessToken?.value);
    if (uid !== targetData.userId) {
      return typedJson<IResponseBody>(
        { response: 'unAuthorized', message: '후기 수정 권한이 없습니다.' },
        { status: 403 },
      );
    }

    // Update logic here...
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
      await updateDoc(reviewDocRef, {
        ...targetData,
        title,
        name,
        franchisee,
        htmlString: imageSrcAppliedHtmlString,
        updatedAt: new Date(),
      });

      return typedJson<IResponseBody>(
        { response: 'ok', message: '리뷰가 성공적으로 작성되었습니다.' },
        { status: 200 },
      );
    } catch (error) {
      console.error('Error updating review post:', error);
      return typedJson<IResponseBody>({ response: 'ng', message: '리뷰 수정에 실패했습니다.' }, { status: 500 });
    }
  } catch (error) {
    if (error != null && typeof error === 'object' && 'code' in error && error.code === 'auth/id-token-expired') {
      return typedJson<IResponseBody>({ response: 'ng', message: 'expired' }, { status: 401 });
    }

    console.error('Error verifying token:', error);
    return typedJson<IResponseBody>({ response: 'ng', message: 'Unauthorized' }, { status: 401 });
  }
}

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
