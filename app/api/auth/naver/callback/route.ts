import { Timestamp } from 'firebase/firestore';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';

import { apiUrl } from '@/src/shared/config';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { IUserDetailData } from '@/src/shared/types';

import { expireOAuthStateCookie, validateOAuthState } from '../../lib/oauthState';
import { checkUserDeletedStatus, signUpUser, trySignIn } from '../../lib/socialAuth';

const ACCESS_TOKEN_OPTIONS = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
};

async function saveUserProfile(uid: string, email: string) {
  const db = getAdminFirestore(firebaseAdminApp);
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
    kakaoAlarmSettings: {
      alarmComment: false,
      alarmNews: false,
      alarmNewPost: false,
      alarmEditPost: false,
      alarmNewComment: false,
      alarmEditComment: false,
    },
  };

  await db.collection('users').doc(uid).set(defaultUserData);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const origin = apiUrl;
  const redirect = (path: string) =>
    expireOAuthStateCookie(NextResponse.redirect(new URL(path, origin)), 'naver');

  if (!validateOAuthState('naver', state)) {
    return redirect('/login?naver_error=invalid_state');
  }

  if (error || !code) {
    const msg = encodeURIComponent(errorDescription ?? error ?? 'unknown');
    return redirect(`/login?naver_error=${msg}`);
  }

  const tokenRes = await fetch(
    `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&state=${state}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' }, cache: 'no-cache' },
  );

  if (!tokenRes.ok) {
    return redirect('/login?naver_error=token_exchange_failed');
  }

  const tokenData = await tokenRes.json();
  const naverAccessToken: string | undefined = tokenData.access_token;

  if (!naverAccessToken) {
    const msg = encodeURIComponent(tokenData.error_description ?? 'token_failed');
    return redirect(`/login?naver_error=${msg}`);
  }

  const userInfoRes = await fetch('https://openapi.naver.com/v1/nid/me', {
    headers: { Authorization: `Bearer ${naverAccessToken}` },
    cache: 'no-cache',
  });

  if (!userInfoRes.ok) {
    return redirect('/login?naver_error=user_info_failed');
  }

  const userInfo = await userInfoRes.json();
  const email: string | undefined = userInfo.response?.email;

  if (!email || userInfo.message !== 'success') {
    return redirect('/login?naver_error=no_email');
  }

  try {
    const user = await trySignIn(email, process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!);

    if (user) {
      const accessToken = await user.user.getIdToken();
      const deletedStatus = await checkUserDeletedStatus(user.user.uid);

      if (deletedStatus === 'deleted_rejoin') {
        const res = redirect('/login?rejoin=true');
        res.cookies.set('accessToken', accessToken, ACCESS_TOKEN_OPTIONS);
        return res;
      }

      if (deletedStatus === 'deleted') {
        return redirect('/login?naver_error=account_deleted');
      }

      const res = redirect('/?naver_success=true');
      res.cookies.set('accessToken', accessToken, ACCESS_TOKEN_OPTIONS);
      return res;
    }

    const newUser = await signUpUser(email, process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!);
    await saveUserProfile(newUser.user.uid, email);
    const newAccessToken = await newUser.user.getIdToken();

    const res = redirect('/?naver_success=true');
    res.cookies.set('accessToken', newAccessToken, ACCESS_TOKEN_OPTIONS);
    return res;
  } catch (error) {
    console.error('Error during Naver OAuth callback:', error);
    return redirect('/login?naver_error=auth_failed');
  }
}
