'use server';

import type { DecodedIdToken } from 'firebase-admin/auth';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';

export async function createSessionCookie(idToken: string, expiresInMs: number): Promise<string> {
  return getAdminAuth(firebaseAdminApp).createSessionCookie(idToken, { expiresIn: expiresInMs });
}

export async function verifySessionCookie(sessionCookieValue: string): Promise<DecodedIdToken> {
  return getAdminAuth(firebaseAdminApp).verifySessionCookie(sessionCookieValue);
}
