import type { UserCredential } from 'firebase/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';

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

export async function GET() {}

async function trySignIn(email: string, password: string) {
  const auth = getAuth();

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    // 이메일 열거 보호 정책으로 이메일이 존재하지 않아도
    // auth/user-not-found 대신 auth/invalid-credential 에러가 발생할 수 있다.
    if (error != null && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
      if (error.code === 'auth/user-not-found') {
        return null;
      }
      if (error.code === 'auth/invalid-credential') {
        return null;
      }
    }

    throw error;
  }
}

async function signUpUser(email: string, password: string) {
  const auth = getAuth();
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result;
}

async function saveUserProfile(uid: string, email: string) {
  const app = firebaseApp;
  const db = getFirestore(app);
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
  // naver ACCESS_TOKEN을 이용하여 사용자 정보를 가져온다.
  if (typeof code === 'string') {
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

    // 로그인&회원가입 로직
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

        // 탈퇴한 유저인지 확인
        const db = getFirestore(firebaseApp);
        const userDocRef = doc(db, 'users', user.user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const targetUserData = userDocSnap.data();

        // deletedAt이 1년 이상 지난 유저는 재가입 가능
        const oneYearAgo = Timestamp.now().toMillis() - 365 * 24 * 60 * 60 * 1000; // 1년 전
        if (
          targetUserData?.isDeleted &&
          targetUserData?.deletedAt &&
          targetUserData.deletedAt.toMillis() > oneYearAgo
        ) {
          // 재가입 가능
          return typedJson<IResponsePostBody>(
            {
              response: 'rejoin',
              message: '재가입 가능한 유저입니다.',
              redirectTo: '/signup/rejoin',
              user,
              accessToken,
              email: user.user.email,
              userData: targetUserData as IUserDetailData,
            },
            { status: 200 },
          );
        }

        // 탈퇴했는데 1년이 지나지 않은 유저는 탈퇴 상태로 처리
        if (targetUserData?.isDeleted) {
          return typedJson<IResponsePostBody>(
            {
              response: 'ng',
              message: '탈퇴한 유저입니다.',
              redirectTo: '/',
              user: null,
              accessToken: null,
            },
            { status: 403 },
          );
        }

        return typedJson<IResponsePostBody>(
          {
            response: 'ok',
            message: '로그인 정보 확인',
            redirectTo: '/',
            user,
            accessToken,
            email: user.user.email,
          },
          { status: 200 },
        );
      } else {
        // 로그인 실패 - 회원가입 진행
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
        {
          redirectTo: '/',
          response: 'ng',
          message: errorCode,
          user: null,
          accessToken: null,
        },
        { status: 500 },
      );
    }
  }
}
