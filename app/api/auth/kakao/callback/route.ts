import { Timestamp } from 'firebase/firestore';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { apiUrl } from '@/src/shared/config';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { createSessionCookie } from '@/src/shared/lib/sessionCookie';
import type { IKakaoTokenResponseBody, IKakaoUserInfoResponseBody, IUserDetailData } from '@/src/shared/types';

import { expireOAuthStateCookie, validateOAuthState } from '../../lib/oauthState';
import { checkUserDeletedStatus, signUpUser, trySignIn } from '../../lib/socialAuth';

const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
};

async function saveUserProfile(uid: string, email: string) {
  const db = getAdminFirestore(firebaseAdminApp);
  const defaultUserData: IUserDetailData = {
    email,
    provider: 'kakao',
    userId: uid,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    grade: 'basic',
    name: '',
    nickname: '',
    phoneNumber: '',
    isDeleted: false,
    deletedAt: null,
    kakaoId: uid,
    kakaoEmail: email,
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
    expireOAuthStateCookie(NextResponse.redirect(new URL(path, origin)), 'kakao');

  if (!validateOAuthState('kakao', state)) {
    return redirect('/login?kakao_error=invalid_state');
  }

  if (error || !code) {
    const msg = encodeURIComponent(errorDescription ?? error ?? 'unknown');
    return redirect(`/login?kakao_error=${msg}`);
  }

  const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!,
      redirect_uri: process.env.NEXT_PUBLIC_KAKAO_CALLBACK_URL!,
      code,
      client_secret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    cache: 'no-cache',
  });

  if (!tokenRes.ok) {
    return redirect('/login?kakao_error=token_exchange_failed');
  }

  const tokenData: IKakaoTokenResponseBody = await tokenRes.json();

  const userInfoRes = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    cache: 'no-cache',
  });

  if (!userInfoRes.ok) {
    return redirect('/login?kakao_error=user_info_failed');
  }

  const userInfo: IKakaoUserInfoResponseBody = await userInfoRes.json();
  const email = userInfo.kakao_account.email;

  if (!email) {
    return redirect('/login?kakao_error=no_email');
  }

  try {
    const user = await trySignIn(email, process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!);

    if (user) {
      const idToken = await user.user.getIdToken();
      const sessionCookie = await createSessionCookie(idToken, SESSION_COOKIE_MAX_AGE_SECONDS * 1000);
      const deletedStatus = await checkUserDeletedStatus(user.user.uid);

      if (deletedStatus === 'deleted_rejoin') {
        const res = redirect('/login?rejoin=true');
        res.cookies.set('session', sessionCookie, SESSION_COOKIE_OPTIONS);
        return res;
      }

      if (deletedStatus === 'deleted') {
        return redirect('/login?kakao_error=account_deleted');
      }

      revalidatePath('/', 'layout');
      const res = redirect('/?kakao_success=true');
      res.cookies.set('session', sessionCookie, SESSION_COOKIE_OPTIONS);
      return res;
    }

    const newUser = await signUpUser(email, process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!);
    await saveUserProfile(newUser.user.uid, email);
    const newIdToken = await newUser.user.getIdToken();
    const newSessionCookie = await createSessionCookie(newIdToken, SESSION_COOKIE_MAX_AGE_SECONDS * 1000);

    revalidatePath('/', 'layout');
    const res = redirect('/?kakao_success=true');
    res.cookies.set('session', newSessionCookie, SESSION_COOKIE_OPTIONS);
    return res;
  } catch (error) {
    console.error('Error during Kakao OAuth callback:', error);
    return redirect('/login?kakao_error=auth_failed');
  }
}
