import type { UserCredential } from 'firebase/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { IUserDetailData } from '@/src/shared/types';

export async function trySignIn(email: string, password: string): Promise<UserCredential | null> {
  const auth = getAuth();
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    // 이메일 열거 보호 정책으로 이메일이 존재하지 않아도
    // auth/user-not-found 대신 auth/invalid-credential 에러가 발생할 수 있다.
    if (error != null && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        return null;
      }
    }
    throw error;
  }
}

export async function signUpUser(email: string, password: string): Promise<UserCredential> {
  const auth = getAuth();
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function checkUserDeletedStatus(uid: string): Promise<'deleted_rejoin' | 'deleted' | 'ok'> {
  const adminDB = getAdminFirestore(firebaseAdminApp);
  const userSnapshot = await adminDB.collection('users').doc(uid).get();

  if (!userSnapshot.exists) {
    return 'ok';
  }

  const userData = userSnapshot.data() as IUserDetailData;
  if (!userData.isDeleted) {
    return 'ok';
  }

  const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
  if (userData.deletedAt && userData.deletedAt.seconds * 1000 > oneYearAgo) {
    return 'deleted_rejoin';
  }

  return 'deleted';
}
