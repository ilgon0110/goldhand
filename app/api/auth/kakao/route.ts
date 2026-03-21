import type { UserCredential } from 'firebase/auth';
import { doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';

import { checkUserDeletedStatus, signUpUser, trySignIn } from '@/src/entities/user';
import { firebaseApp } from '@/src/shared/config/firebase';
import type { IKakaoTokenResponseBody, IKakaoUserInfoResponseBody, IUserDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponsePostBody {
  response: 'ng' | 'ok' | 'rejoin';
  message: string;
  redirectTo: string;
  user: UserCredential | null;
  accessToken: string | null;
  email?: string | null;
  userData?: IUserDetailData | null;
}

interface IKakaoLoginRequestBody {
  code: string;
}

async function saveUserProfile(uid: string, email: string) {
  const db = getFirestore(firebaseApp);
  const defaultUserData: IUserDetailData = {
    email: email,
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
  return await setDoc(doc(db, 'users', uid), defaultUserData);
}

export async function POST(req: Request) {
  const { code } = (await req.json()) as IKakaoLoginRequestBody;

  if (typeof code !== 'string') return;

  const kakaoResponse: Response = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!,
      redirect_uri: process.env.NEXT_PUBLIC_KAKAO_CALLBACK_URL!,
      code: code,
    }).toString(),
    cache: 'no-cache',
  });

  const kakaoTokenData: IKakaoTokenResponseBody = await kakaoResponse.json();
  if (kakaoResponse.status !== 200) {
    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: '카카오 로그인 정보가 유효하지 않습니다.',
        redirectTo: '/',
        user: null,
        accessToken: null,
      },
      { status: 500 },
    );
  }

  const kakaoUserInfoResponse: Response = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${kakaoTokenData.access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    cache: 'no-cache',
  });

  if (kakaoUserInfoResponse.status !== 200) {
    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: '카카오 사용자 정보를 가져오는 데 실패했습니다.',
        redirectTo: '/',
        user: null,
        accessToken: null,
      },
      { status: 500 },
    );
  }

  const kakaoUserInfo: IKakaoUserInfoResponseBody = await kakaoUserInfoResponse.json();
  const email = kakaoUserInfo.kakao_account.email;

  if (!email) {
    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: '카카오 계정에 이메일 정보가 없습니다.',
        redirectTo: '/',
        user: null,
        accessToken: null,
      },
      { status: 400 },
    );
  }

  try {
    const user = await trySignIn(email, process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!);
    if (user) {
      const accessToken = await user.user.getIdToken();
      const deletedStatus = await checkUserDeletedStatus(user.user.uid);

      if (deletedStatus === 'deleted_rejoin') {
        return typedJson<IResponsePostBody>(
          {
            response: 'rejoin',
            message: '재가입 가능한 유저입니다.',
            redirectTo: '/signup/rejoin',
            user,
            accessToken,
            email: user.user.email,
          },
          { status: 200 },
        );
      }

      if (deletedStatus === 'deleted') {
        return typedJson<IResponsePostBody>(
          { response: 'ng', message: '탈퇴한 유저입니다.', redirectTo: '/', user: null, accessToken: null },
          { status: 403 },
        );
      }

      return typedJson<IResponsePostBody>(
        { response: 'ok', message: '로그인 정보 확인', redirectTo: '/', user, accessToken, email: user.user.email },
        { status: 200 },
      );
    } else {
      const newUser = await signUpUser(email, process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!);
      await saveUserProfile(newUser.user.uid, email);
      const newUserAccessToken = await newUser.user.getIdToken();

      return typedJson<IResponsePostBody>(
        {
          redirectTo: '/',
          user: newUser,
          response: 'ok',
          message: '카카오 계정으로 회원가입이 완료되었습니다.',
          accessToken: newUserAccessToken,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    const errorCode =
      typeof error === 'object' && error != null && 'code' in error && typeof error.code === 'string'
        ? error.code
        : 'unknown_error';
    return typedJson<IResponsePostBody>(
      { redirectTo: '/', response: 'ng', message: errorCode, user: null, accessToken: null },
      { status: 500 },
    );
  }
}
