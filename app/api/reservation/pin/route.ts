import { doc, getDoc, getFirestore } from 'firebase/firestore';

import { firebaseApp } from '@/src/shared/config/firebase';
import { checkAdminAuth } from '@/src/shared/lib/checkAdminAuth';
import { togglePinClient } from '@/src/shared/lib/pin/toggleIsPinned';
import { typedJson } from '@/src/shared/utils';

interface IPinRequestBody {
  docId: string;
  isPinned: boolean;
}

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

export async function POST(req: Request) {
  let body: IPinRequestBody;
  try {
    body = (await req.json()) as IPinRequestBody;
  } catch {
    return typedJson<IResponseBody>({ response: 'ng', message: '요청 본문이 올바르지 않습니다.' }, { status: 400 });
  }
  const { docId, isPinned } = body;

  if (!docId) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'docId is required' }, { status: 400 });
  }

  const authResult = await checkAdminAuth();
  if (!authResult.ok) {
    return typedJson<IResponseBody>({ response: 'ng', message: '로그인 정보가 존재하지 않습니다.' }, { status: 401 });
  }
  if (!authResult.isAdmin) {
    return typedJson<IResponseBody>({ response: 'ng', message: '관리자 권한이 없습니다.' }, { status: 403 });
  }

  const db = getFirestore(firebaseApp);
  const docSnap = await getDoc(doc(db, 'consults', docId));
  if (!docSnap.exists()) {
    return typedJson<IResponseBody>({ response: 'ng', message: '해당 docId를 가진 게시글이 존재하지 않습니다.' }, { status: 404 });
  }

  try {
    await togglePinClient('consults', docId, isPinned);
    return typedJson<IResponseBody>(
      { response: 'ok', message: isPinned ? '게시글을 고정했습니다.' : '게시글 고정을 해제했습니다.' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error toggling reservation pin:', error);
    return typedJson<IResponseBody>({ response: 'ng', message: '고정 처리 중 오류가 발생하였습니다.' }, { status: 500 });
  }
}
