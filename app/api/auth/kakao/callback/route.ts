import { doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { apiUrl } from '@/src/shared/config';
import { firebaseApp } from '@/src/shared/config/firebase';
import type { IKakaoTokenResponseBody, IKakaoUserInfoResponseBody, IUserDetailData } from '@/src/shared/types';

import { checkUserDeletedStatus, signUpUser, trySignIn } from '../../lib/socialAuth';

const ACCESS_TOKEN_OPTIONS = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  sameSite: 'strict' as const,
};

async function saveUserProfile(uid: string, email: string) {
  const db = getFirestore(firebaseApp);
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
  };
  await setDoc(doc(db, 'users', uid), defaultUserData);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const origin = apiUrl;

  if (error || !code) {
    const msg = encodeURIComponent(errorDescription ?? error ?? 'unknown');
    return NextResponse.redirect(new URL(`/login?kakao_error=${msg}`, origin));
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
    return NextResponse.redirect(new URL('/login?kakao_error=token_exchange_failed', origin));
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
    return NextResponse.redirect(new URL('/login?kakao_error=user_info_failed', origin));
  }

  const userInfo: IKakaoUserInfoResponseBody = await userInfoRes.json();
  const email = userInfo.kakao_account.email;

  if (!email) {
    return NextResponse.redirect(new URL('/login?kakao_error=no_email', origin));
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
        return NextResponse.redirect(new URL('/login?kakao_error=account_deleted', origin));
      }

      revalidatePath('/', 'layout');
      const res = NextResponse.redirect(new URL('/?kakao_success=true', origin));
      res.cookies.set('accessToken', accessToken, ACCESS_TOKEN_OPTIONS);
      return res;
    }

    const newUser = await signUpUser(email, process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!);
    await saveUserProfile(newUser.user.uid, email);
    const newAccessToken = await newUser.user.getIdToken();

    revalidatePath('/', 'layout');
    const res = NextResponse.redirect(new URL('/?kakao_success=true', origin));
    res.cookies.set('accessToken', newAccessToken, ACCESS_TOKEN_OPTIONS);
    return res;
  } catch {
    return NextResponse.redirect(new URL('/login?kakao_error=auth_failed', origin));
  }
}
