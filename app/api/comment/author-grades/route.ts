import { FieldPath, getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { typedJson } from '@/src/shared/utils';

interface IRequestBody {
  userIds: string[];
}

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
  adminUserIds: string[];
}

const CHUNK_SIZE = 30;

export async function POST(req: Request) {
  let body: IRequestBody;
  try {
    body = (await req.json()) as IRequestBody;
  } catch {
    return typedJson<IResponseBody>(
      { response: 'ng', message: '요청 본문이 올바르지 않습니다.', adminUserIds: [] },
      { status: 400 },
    );
  }

  const uniqueUserIds = Array.from(
    new Set((body.userIds ?? []).filter((id): id is string => typeof id === 'string' && id.length > 0)),
  );

  if (uniqueUserIds.length === 0) {
    return typedJson<IResponseBody>({ response: 'ok', message: 'ok', adminUserIds: [] }, { status: 200 });
  }

  try {
    const adminDB = getAdminFirestore(firebaseAdminApp);
    const adminUserIds: string[] = [];

    for (let i = 0; i < uniqueUserIds.length; i += CHUNK_SIZE) {
      const chunk = uniqueUserIds.slice(i, i + CHUNK_SIZE);
      const snap = await adminDB.collection('users').where(FieldPath.documentId(), 'in', chunk).get();
      snap.docs.forEach(doc => {
        if (doc.data().grade === 'admin') {
          adminUserIds.push(doc.id);
        }
      });
    }

    return typedJson<IResponseBody>({ response: 'ok', message: 'ok', adminUserIds }, { status: 200 });
  } catch (error) {
    console.error('Error fetching author grades:', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: '작성자 정보 조회 중 오류가 발생하였습니다.', adminUserIds: [] },
      { status: 500 },
    );
  }
}
