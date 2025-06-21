import type { UserCredential } from 'firebase/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

import { firebaseApp } from '@/src/shared/config/firebase';
import { typedJson } from '@/src/shared/utils';

interface IResponseGetBody {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  accessToken: string | null;
}

interface IResponsePostBody {
  response: string;
  message: string;
  redirectTo: string;
  user: UserCredential | null;
  accessToken: string | null;
  customToken?: string;
  email?: string | null;
}

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');

  if (accessToken == null || accessToken?.value === 'undefined' || accessToken.value === '') {
    return typedJson<IResponseGetBody>(
      {
        response: 'unAuthorized',
        message: '로그인되지 않았습니다.',
        accessToken: null,
      },
      { status: 200 },
    );
  }

  // 여기서 실제 accessToken이 유효한지 확인하고, 유효하지 않으면 unauthorized 처리
  try {
    await getAdminAuth().verifyIdToken(accessToken.value);

    return typedJson<IResponseGetBody>(
      {
        response: 'ok',
        message: '로그인 된 상태입니다.',
        accessToken: accessToken.value,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error verifying token:', error);
    if (error != null && typeof error == 'object' && 'code' in error && error.code === 'auth/id-token-expired') {
      return typedJson<IResponseGetBody>(
        {
          response: 'unAuthorized',
          message: '토큰이 만료되었습니다.',
          accessToken: null,
        },
        { status: 200 },
      );
    }

    const errorCode =
      typeof error === 'object' && error != null && 'code' in error && typeof error.code === 'string'
        ? error.code
        : 'unknown_error';

    return typedJson<IResponseGetBody>({ response: 'ng', message: errorCode, accessToken: null }, { status: 500 });
  }
}

async function trySignIn(email: string, password: string) {
  const auth = getAuth();
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    if (error != null && typeof error === 'object' && 'code' in error && error.code === 'auth/invalid-credential') {
      return null;
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
  return await setDoc(doc(db, 'users', uid), {
    email: email,
    provider: 'naver',
    uid,
    createdAt: new Date(),
    updatedAt: new Date(),
    grade: 'basic',
    point: 0,
    name: '',
    nickname: '',
    phoneNumber: '',
  });
}

export async function POST(req: Request) {
  const { access_token } = await req.json();
  // naver ACCESS_TOKEN을 이용하여 사용자 정보를 가져온다.
  if (typeof access_token === 'string') {
    const profileData = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-cache',
    });

    const userData = await profileData.json();
    const email = userData.response.email;
    const user = await trySignIn(email, process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!);
    // firebase auth에 로그인된 유저가 있는지 확인
    if (user) {
      try {
        const accessToken = await user.user.getIdToken();

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
      } catch (error) {
        console.error('Error setting cookie:', error);

        // OAuth로그인은 성공했으나 firebase에 정보 없는 유저 - 회원가입
        if (typeof error === 'object' && error != null && 'code' in error && error.code === 'auth/user-not-found') {
          try {
            const newUser = await signUpUser(email, process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!);
            await saveUserProfile(newUser.user.uid, email);
            const newUserAccessToken = await newUser.user.getIdToken();

            return typedJson<IResponsePostBody>(
              {
                redirectTo: '/signup',
                user: newUser,
                response: 'ok',
                message: 'oAuth 로그인 성공, 회원가입 페이지로 이동합니다.',
                accessToken: newUserAccessToken,
              },
              { status: 200 },
            );
          } catch (error) {
            console.error('Error signing up:', error);
            if (typeof error === 'object' && error != null && 'code' in error && typeof error.code === 'string') {
              return typedJson<IResponsePostBody>(
                {
                  redirectTo: '/',
                  response: 'ng',
                  message: error.code,
                  user: null,
                  accessToken: null,
                },
                { status: 500 },
              );
            }

            return typedJson<IResponsePostBody>(
              {
                redirectTo: '/',
                response: 'ng',
                message: '회원가입 중 오류가 발생했습니다.',
                user: null,
                accessToken: null,
              },
              { status: 500 },
            );
          }
        }

        // 그 외의 에러 처리
        const errorCode =
          typeof error === 'object' && error != null && 'code' in error && typeof error.code === 'string'
            ? error.code
            : 'unknown_error';
        return typedJson<IResponsePostBody>(
          {
            response: 'ng',
            message: errorCode,
            redirectTo: '/login',
            user: null,
            accessToken: null,
          },
          { status: 500 },
        );
      }
    }

    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: '로그인에 실패했습니다.',
        redirectTo: '/login',
        user: null,
        accessToken: null,
      },
      { status: 401 },
    );
  }
}
