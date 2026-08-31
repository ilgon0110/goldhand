'use server';

import { getAuth as getAdminAuth } from 'firebase-admin/auth';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';

type TVerifyPhoneIdTokenResult =
  | { ok: false; reason: 'expired' | 'invalid' | 'no_phone_claim' }
  | { ok: true; phoneNumber: string };

export async function verifyPhoneIdToken(idToken: string): Promise<TVerifyPhoneIdTokenResult> {
  let decodedToken;
  try {
    decodedToken = await getAdminAuth(firebaseAdminApp).verifyIdToken(idToken);
  } catch (error) {
    if (error != null && typeof error === 'object' && 'code' in error && error.code === 'auth/id-token-expired') {
      return { ok: false, reason: 'expired' };
    }
    return { ok: false, reason: 'invalid' };
  }

  const phoneNumber = decodedToken.phone_number;
  if (typeof phoneNumber !== 'string' || phoneNumber.length === 0) {
    return { ok: false, reason: 'no_phone_claim' };
  }

  return { ok: true, phoneNumber };
}
