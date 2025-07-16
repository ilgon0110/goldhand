import { doc, getDoc, getFirestore, increment, setDoc, updateDoc } from 'firebase/firestore';
import type { NextRequest } from 'next/server';

import { firebaseApp } from '@/src/shared/config/firebase';
import type { IViewCountData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';
import { isViewerIdValid } from '@/src/shared/utils/verifyViewId';

const WINDOW_MS = 1000 * 60 * 30;

interface IResponseGetBody {
  response: 'ng' | 'ok';
  data: IViewCountData | null;
  message: string;
}

interface IResponsePostBody {
  response: 'duplicate' | 'ng' | 'ok';
  message: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const docId = searchParams.get('docId');

  if (!docId) {
    return typedJson<IResponseGetBody>(
      {
        response: 'ng',
        message: 'docId is required',
        data: null,
      },
      { status: 400 },
    );
  }

  try {
    const app = firebaseApp;
    const db = getFirestore(app);
    const viewCountDocRef = doc(db, 'viewCounts', docId);
    const docSnap = await getDoc(viewCountDocRef);

    if (!docSnap.exists()) {
      return typedJson<IResponseGetBody>(
        {
          response: 'ng',
          message: 'no such document',
          data: null,
        },
        { status: 404 },
      );
    }

    return typedJson<IResponseGetBody>(
      {
        response: 'ok',
        message: 'Document found',
        data: docSnap.data() as IViewCountData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching view count:', error);
    return typedJson<IResponseGetBody>(
      {
        response: 'ng',
        message: 'Error fetching view count',
        data: null,
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const { docId, viewerId, signature } = await req.json();

  if (!isViewerIdValid(viewerId, signature)) {
    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: 'Invalid viewer ID or signature',
      },
      { status: 400 },
    );
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const now = Date.now();

  const db = getFirestore(firebaseApp);
  // ✅ 중복 로그 저장 경로: /viewCounts/[docId]/logs/[viewerId_or_ip]
  const logId = `${viewerId}_${ip}`;
  const logRef = doc(db, 'viewCounts', docId, 'logs', logId);
  const snapshot = await getDoc(logRef);

  if (snapshot.exists() && now - snapshot.data().timestamp < WINDOW_MS) {
    return typedJson<IResponsePostBody>(
      {
        response: 'duplicate',
        message: 'View already recorded within the time window',
      },
      { status: 200 },
    );
  }

  const countRef = doc(db, 'viewCounts', docId);
  const countSnap = await getDoc(countRef);

  // ✅ 1. 로그 저장
  await setDoc(logRef, { timestamp: now });

  // ✅ 2. 조회수 증가 (totalViewCount 필드)
  if (countSnap.exists()) {
    console.log('Updating existing view count');
    await updateDoc(countRef, {
      totalViewCount: increment(1),
    });
  } else {
    await setDoc(countRef, {
      totalViewCount: 1,
    });
  }
  return typedJson<IResponsePostBody>(
    {
      response: 'ok',
      message: 'View recorded successfully',
    },
    { status: 200 },
  );
}
