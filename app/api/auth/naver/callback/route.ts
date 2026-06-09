import { doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';
import { NextResponse } from 'next/server';

import { apiUrl } from '@/src/shared/config';
import { firebaseApp } from '@/src/shared/config/firebase';
import type { IUserDetailData } from '@/src/shared/types';

import { checkUserDeletedStatus, signUpUser, trySignIn } from '../../lib/socialAuth';

const ACCESS_TOKEN_OPTIONS = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
};

async function saveUserProfile(uid: string, email: string) {
  const db = getFirestore(firebaseApp);
  const defaultUserData: IUserDetailData = {
    email,
    provider: 'naver',
    userId: uid,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    grade: 'basic',
    name: '',
    nickname: '',
    phoneNumber: '',
    isDeleted: false,
    deletedAt: null,
    kakaoId: null,
    kakaoEmail: null,
  };
  await setDoc(doc(db, 'users', uid), defaultUserData);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const origin = apiUrl;

  if (error || !code || state !== process.env.NEXT_PUBLIC_STATE_STRING) {
    const msg = encodeURIComponent(errorDescription ?? error ?? 'unknown');
    return NextResponse.redirect(new URL(`/login?naver_error=${msg}`, origin));
  }

  const tokenRes = await fetch(
    `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&state=${state}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' }, cache: 'no-cache' },
  );

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/login?naver_error=token_exchange_failed', origin));
  }

  const tokenData = await tokenRes.json();
  const naverAccessToken: string | undefined = tokenData.access_token;

  if (!naverAccessToken) {
    const msg = encodeURIComponent(tokenData.error_description ?? 'token_failed');
    return NextResponse.redirect(new URL(`/login?naver_error=${msg}`, origin));
  }

  const userInfoRes = await fetch('https://openapi.naver.com/v1/nid/me', {
    headers: { Authorization: `Bearer ${naverAccessToken}` },
    cache: 'no-cache',
  });

  if (!userInfoRes.ok) {
    return NextResponse.redirect(new URL('/login?naver_error=user_info_failed', origin));
  }

  const userInfo = await userInfoRes.json();
  const email: string | undefined = userInfo.response?.email;

  if (!email || userInfo.message !== 'success') {
    return NextResponse.redirect(new URL('/login?naver_error=no_email', origin));
  }

  try {
    const user = await trySignIn(email, process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!);

    if (user) {
      const accessToken = await user.user.getIdToken();
      const deletedStatus = await checkUserDeletedStatus(user.user.uid);

      if (deletedStatus === 'deleted_rejoin') {
        const res = NextResponse.redirect(new URL('/login?rejoin=true', origin));
        res.cookies.set('accessToken', accessToken, ACCESS_TOKEN_OPTIONS);
        return res;
      }

      if (deletedStatus === 'deleted') {
        return NextResponse.redirect(new URL('/login?naver_error=account_deleted', origin));
      }

      const res = NextResponse.redirect(new URL('/?naver_success=true', origin));
      res.cookies.set('accessToken', accessToken, ACCESS_TOKEN_OPTIONS);
      return res;
    }

    const newUser = await signUpUser(email, process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!);
    await saveUserProfile(newUser.user.uid, email);
    const newAccessToken = await newUser.user.getIdToken();

    const res = NextResponse.redirect(new URL('/?naver_success=true', origin));
    res.cookies.set('accessToken', newAccessToken, ACCESS_TOKEN_OPTIONS);
    return res;
  } catch {
    return NextResponse.redirect(new URL('/login?naver_error=auth_failed', origin));
  }
}
