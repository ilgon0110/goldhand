import bcrypt from 'bcryptjs';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { typedJson } from '@/src/shared/utils';

interface IConsultPost {
  title: string;
  password: string | null;
  franchisee: string;
  content: string;
  location: string;
  secret: boolean;
  bornDate: Date | undefined;
  name: string;
  phoneNumber: string;
  recaptchaToken: string;
}

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  docId?: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as IConsultPost;
  const { title, name, password, secret, franchisee, phoneNumber, location, content, bornDate, recaptchaToken } = body;

  if (!title || !content || !location || !name || !phoneNumber || !franchisee || !recaptchaToken) {
    return typedJson<IResponseBody>(
      { response: 'ng', message: '필수로 입력해야하는 필드를 입력해주세요.' },
      { status: 400 },
    );
  }

  // reCAPTCHA 검증
  const recaptchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
  });
  const recaptchaData = await recaptchaRes.json();

  if (!recaptchaData.success || recaptchaData.score < 0.5) {
    return typedJson<IResponseBody>({ response: 'ng', message: 'reCAPTCHA 검증에 실패했습니다.' }, { status: 403 });
  }

  // 회원인지 비회원인지 확인
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  try {
    if (accessToken === undefined) {
      return createNonMemberPost(body);
    }

    const { uid } = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value);

    // 탈퇴한 유저인지 확인
    const db = getFirestore(firebaseApp);
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    const targetUserData = userDocSnap.data();
    if (targetUserData?.isDeleted) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '탈퇴한 유저로 상담글을 작성할 수 없습니다. 재가입하거나 비회원으로 작성해주세요',
        },
        { status: 403 },
      );
    }

    if (uid) {
      return createMemberPost(uid, body);
    }
  } catch (error: any) {
    if (error.code === 'auth/id-token-expired') {
      return typedJson<IResponseBody>({ response: 'expired', message: '토큰이 만료되었습니다.' }, { status: 401 });
    }

    console.error('Error verifying token:', error);
    return typedJson<IResponseBody>({ response: 'ng', message: 'Unauthorized' }, { status: 401 });
  }
}

// 비회원일 경우
async function createNonMemberPost(body: IConsultPost) {
  const { title, name, password, secret, franchisee, phoneNumber, location, content, bornDate } = body;
  // 비밀번호 검중 후 hash
  if (password === null || password.length < 4) {
    return typedJson<IResponseBody>(
      { response: 'ng', message: '비밀번호는 4자리 이상이어야 합니다.' },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // firestore에 데이터 저장
  const app = firebaseApp;
  const db = getFirestore(app);
  const docId = uuidv4();

  try {
    await setDoc(doc(db, 'consults', docId), {
      title,
      content,
      location,
      secret,
      bornDate: bornDate === undefined ? null : bornDate,
      name,
      phoneNumber,
      franchisee,
      password: hashedPassword,
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return typedJson<IResponseBody>(
      {
        response: 'ok',
        message: '비회원으로 데이터 저장에 성공했습니다.',
        docId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error adding document: ', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: '비회원으로 데이터 저장에 실패했습니다.' },
      { status: 500 },
    );
  }
}

// 회원일 경우
async function createMemberPost(uid: string, body: IConsultPost) {
  const { title, name, secret, franchisee, phoneNumber, location, content, bornDate } = body;

  // firestore에 데이터 저장
  const app = firebaseApp;
  const db = getFirestore(app);
  const docId = uuidv4();

  try {
    await setDoc(doc(db, 'consults', docId), {
      title,
      content,
      location,
      secret,
      bornDate: bornDate === undefined ? null : bornDate,
      name,
      phoneNumber,
      franchisee,
      password: null,
      userId: uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return typedJson<IResponseBody>(
      {
        response: 'ok',
        message: '회원으로 데이터 저장에 성공했습니다.',
        docId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error adding document: ', error);
    return typedJson<IResponseBody>(
      { response: 'ng', message: '회원으로 데이터 저장에 실패했습니다.' },
      { status: 500 },
    );
  }
}
