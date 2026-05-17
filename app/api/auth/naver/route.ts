import type { UserCredential } from 'firebase/auth';
import { doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';

import { checkUserDeletedStatus, signUpUser, trySignIn } from '@/src/entities/user';
import { firebaseApp } from '@/src/shared/config/firebase';
import type { IUserDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponsePostBody {
  response: 'ng' | 'ok';
  message: string;
  redirectTo: string;
  user: UserCredential | null;
  accessToken: string | null;
  email?: string | null;
  userData?: IUserDetailData | null;
}

async function saveUserProfile(uid: string, email: string) {
  const db = getFirestore(firebaseApp);
  const defaultUserData: IUserDetailData = {
    email: email,
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
  return await setDoc(doc(db, 'users', uid), defaultUserData);
}

export async function POST(req: Request) {
  const { access_token } = await req.json();

  if (typeof access_token === 'string') {
    const profileData = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-cache',
    });

    const userData = await profileData.json();
    const email = userData.response.email;

    if (userData.message !== 'success') {
      return typedJson<IResponsePostBody>(
        {
          response: 'ng',
          message: '네이버 로그인 정보가 유효하지 않습니다.',
          redirectTo: '/',
          user: null,
          accessToken: null,
        },
        { status: 500 },
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
              response: 'ng',
              message: '재가입 가능한 유저입니다.',
              redirectTo: '/signup/rejoin',
              user,
              accessToken,
              email: user.user.email,
            },
            { status: 409 },
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
            message: '네이버 계정으로 회원가입이 완료되었습니다.',
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
}
