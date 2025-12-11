import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { ackNotification } from '@/src/shared/lib/alarm';
import type { IUserDetailData } from '@/src/shared/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');
  if (!accessToken) return new Response('unauthorized', { status: 401 });

  const adminApp = getAdminAuth(firebaseAdminApp);
  let decoded: any;
  try {
    decoded = await adminApp.verifyIdToken(accessToken.value);
  } catch (err) {
    return new Response('unauthorized', { status: 401 });
  }

  const uid = decoded.uid;
  const adminDB = getAdminFirestore(firebaseAdminApp);
  const userSnapshot = await adminDB.collection('users').doc(uid).get();
  if (!userSnapshot.exists) return new Response('unauthorized', { status: 401 });
  const userData = userSnapshot.data() as IUserDetailData;
  const userId = userData.userId;

  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    return new Response('invalid body', { status: 400 });
  }

  const notificationId = body.notificationId;
  if (!notificationId) return new Response('notificationId required', { status: 400 });

  const ok = ackNotification(notificationId, userId);
  if (!ok) return new Response('not found or already acked', { status: 404 });

  return new Response('acknowledged', { status: 200 });
}
