import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import { resolvePostImageFields } from '@/src/entities/image/api/resolvePostImageFields';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { checkAdminAuth } from '@/src/shared/lib/server';
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
  response: 'ng' | 'ok';
  message: string;
  docId: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as IEventPost;
  const { title, htmlString, name, status } = body;
  if (!title || !htmlString || !name || !status) {
    return typedJson<IResponseBody>(
      { response: 'ng', message: '필수로 입력해야하는 필드를 입력해주세요.', docId: '' },
      { status: 400 },
    );
  }

  const authResult = await checkAdminAuth(true);
  if (!authResult.ok) {
    if (authResult.reason === 'no_token') {
      return typedJson<IResponseBody>(
        { response: 'ng', message: '로그인 정보가 존재하지 않습니다.', docId: '' },
        { status: 403 },
      );
    }
    return typedJson<IResponseBody>(
      { response: 'ng', message: '로그인 정보 확인 도중 오류가 발생하였습니다.', docId: '' },
      { status: 401 },
    );
  }

  if (!authResult.isAdmin) {
    return typedJson<IResponseBody>({ response: 'ng', message: '관리자 권한이 없습니다.', docId: '' }, { status: 403 });
  }

  try {
    return createEventPost(authResult.uid, body);
  } catch (error) {
    console.error('Error creating event:', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: '로그인 정보 확인 도중 오류가 발생하였습니다.', docId: '' },
      { status: 401 },
    );
  }
}

const createEventPost = async (uid: string, body: IEventPost) => {
  const { title, htmlString, docId, images, name, status } = body;

  const imageFields = resolvePostImageFields({ htmlString, images });

  const adminDB = getAdminFirestore(firebaseAdminApp);

  try {
    await adminDB
      .collection('events')
      .doc(docId)
      .set({
        id: docId,
        ...imageFields,
        title,
        name,
        userId: uid,
        status,
        isPinned: false,
        pinnedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    return typedJson<IResponseBody>(
      { response: 'ok', message: '소식이 성공적으로 작성되었습니다.', docId },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error creating event post:', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: '소식 작성 도중 알 수 없는 오류가 발생하였습니다.', docId: '' },
      { status: 500 },
    );
  }
};
