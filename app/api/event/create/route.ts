import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { typedJson } from '@/src/shared/utils';

interface IEventPost {
  name: string;
  title: string;
  htmlString: string;
  docId: string;
  status: string;
  images: { key: string; url: string }[] | null;
}

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  docId?: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as IEventPost;
  const { title, htmlString, name, status } = body;
  if (!title || !htmlString || !name || !status) {
    return typedJson<IResponseBody>(
      { response: 'ng', message: '필수로 입력해야하는 필드를 입력해주세요.' },
      { status: 400 },
    );
  }

  try {
    // 사용자 데이터 가져오기 - 관리자 권한 확인
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '로그인 토큰이 존재하지 않습니다.',
        },
        { status: 403 },
      );
    }

    const decodedToken = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value);
    const uid = decodedToken.uid;
    const adminDB = getAdminFirestore(firebaseAdminApp);

    const adminUserDocRef = adminDB.collection('users').doc(uid);
    const adminUserDocSnap = await adminUserDocRef.get();
    const isAdmin = adminUserDocSnap.data()?.grade === 'admin';

    if (!isAdmin) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '관리자 권한이 없습니다.',
        },
        { status: 403 },
      );
    }

    const dataSize = await adminDB
      .collection('events')
      .get()
      .then(snapshot => snapshot.size);

    return createEventPost(uid, body, dataSize);
  } catch (error) {
    console.error('Error verifying token:', error);
    return typedJson<IResponseBody>({ response: 'ng', message: 'Unauthorized' }, { status: 401 });
  }
}

const createEventPost = async (uid: string, body: IEventPost, dataSize: number) => {
  const { title, htmlString, docId, images, name, status } = body;

  // htmlString 중 img 태그는 유지하면서 src의 속성만 제거
  const cleanedHtmlString = htmlString.replace(/<img\s+[^>]*src=["']data:image\/[^"']*["'][^>]*>/gi, match => {
    // src 속성을 ""로 바꾼 새로운 img 태그를 반환
    return match.replace(/src=["']data:image\/[^"']*["']/, 'src=""');
  });
  const imageSrcAppliedHtmlString = applyFireImageSrc(cleanedHtmlString, images || []);

  const adminDB = getAdminFirestore(firebaseAdminApp);

  try {
    await adminDB
      .collection('events')
      .doc(docId)
      .set({
        id: docId,
        rowNumber: dataSize + 1,
        title,
        name,
        userId: uid,
        htmlString: imageSrcAppliedHtmlString,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    return typedJson<IResponseBody>(
      { response: 'ok', message: '이벤트가 성공적으로 작성되었습니다.', docId },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error creating event post:', error);
    return typedJson<IResponseBody>({ response: 'ng', message: '이벤트 작성에 실패했습니다.' }, { status: 500 });
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
