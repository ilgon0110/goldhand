import { firebaseApp } from "@/src/shared/config/firebase";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { cookies } from "next/headers";
import { typedJson } from "@/src/shared/utils";

interface ConsultPost {
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

interface ResponseBody {
  response: "ok" | "ng" | "expired" | "unAuthorized";
  message: string;
  docId?: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as ConsultPost;
  const {
    title,
    name,
    password,
    secret,
    franchisee,
    phoneNumber,
    location,
    content,
    bornDate,
    recaptchaToken,
  } = body;

  if (
    !title ||
    !content ||
    !location ||
    !name ||
    !phoneNumber ||
    !franchisee ||
    !recaptchaToken
  ) {
    return typedJson<ResponseBody>(
      { response: "ng", message: "필수로 입력해야하는 필드를 입력해주세요." },
      { status: 400 }
    );
  }

  // reCAPTCHA 검증
  const recaptchaRes = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    }
  );
  const recaptchaData = await recaptchaRes.json();

  if (!recaptchaData.success || recaptchaData.score < 0.5) {
    return typedJson<ResponseBody>(
      { response: "ng", message: "reCAPTCHA 검증에 실패했습니다." },
      { status: 403 }
    );
  }

  // 회원인지 비회원인지 확인
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  console.log("body:", body);
  try {
    if (accessToken === undefined) {
      return createNonMemberPost(body);
    }

    const { uid } = await getAdminAuth().verifyIdToken(accessToken.value);
    if (uid) {
      return createMemberPost(uid, body);
    }
  } catch (error: any) {
    if (error.code === "auth/id-token-expired") {
      console.log("토큰 만료됨");
      return typedJson<ResponseBody>(
        { response: "ng", message: "expired" },
        { status: 401 }
      );
    }

    console.error("Error verifying token:", error);
    return typedJson<ResponseBody>(
      { response: "ng", message: "Unauthorized" },
      { status: 401 }
    );
  }
}

// 비회원일 경우
async function createNonMemberPost(body: ConsultPost) {
  const {
    title,
    name,
    password,
    secret,
    franchisee,
    phoneNumber,
    location,
    content,
    bornDate,
  } = body;
  // 비밀번호 검중 후 hash
  if (password === null || password.length < 4) {
    return typedJson<ResponseBody>(
      { response: "ng", message: "비밀번호는 4자리 이상이어야 합니다." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // firestore에 데이터 저장
  const app = firebaseApp;
  const db = getFirestore(app);
  const docId = uuidv4();

  try {
    await setDoc(doc(db, "consults", docId), {
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
    return typedJson<ResponseBody>(
      {
        response: "ok",
        message: "비회원으로 데이터 저장에 성공했습니다.",
        docId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding document: ", error);
    return typedJson<ResponseBody>(
      { response: "ng", message: "비회원으로 데이터 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}

// 회원일 경우
async function createMemberPost(uid: string, body: ConsultPost) {
  const {
    title,
    name,
    secret,
    franchisee,
    phoneNumber,
    location,
    content,
    bornDate,
  } = body;

  // firestore에 데이터 저장
  const app = firebaseApp;
  const db = getFirestore(app);
  const docId = uuidv4();

  try {
    await setDoc(doc(db, "consults", docId), {
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
    return typedJson<ResponseBody>(
      {
        response: "ok",
        message: "회원으로 데이터 저장에 성공했습니다.",
        docId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding document: ", error);
    return typedJson<ResponseBody>(
      { response: "ng", message: "회원으로 데이터 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}
