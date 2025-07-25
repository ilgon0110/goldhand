import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { firebaseApp } from '@/src/shared/config/firebase';
import { typedJson } from '@/src/shared/utils';

interface IConsultPost {
  name: string;
  phoneNumber: string;
  email: string;
  location: string;
  franchisee: string;
  content: string;
  recaptchaToken: string;
}

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as IConsultPost;
  const { name, phoneNumber, email, location, franchisee, content, recaptchaToken } = body;

  if (!name || !phoneNumber || !email || !location || !franchisee || !content || !recaptchaToken) {
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

  // firestore에 데이터 저장
  const app = firebaseApp;
  const db = getFirestore(app);
  const docId = uuidv4();

  try {
    await setDoc(doc(db, 'managers', docId), {
      name,
      phoneNumber,
      email,
      location,
      franchisee,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return typedJson<IResponseBody>(
      {
        response: 'ok',
        message: '관리사 신청서 저장에 성공했습니다.',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error adding document: ', error);
    return typedJson<IResponseBody>({ response: 'ng', message: '관리사 신청서 저장에 실패했습니다.' }, { status: 500 });
  }
}
