import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { firebaseApp } from "@/src/shared/config/firebase";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { typedJson } from "@/src/shared/utils";
import { firebaseAdminApp } from "@/src/shared/config/firebase-admin";

interface ResponseGetBody {
  response: "ok" | "ng" | "unAuthorized";
  message: string;
  user: UserCredential | null;
}

interface ResponsePostBody {
  response: "ok" | "ng" | "unAuthorized";
  message: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { provider: string } },
  res: NextApiResponse
) {}

export async function POST(req: Request) {
  const app = firebaseApp;
  const auth = getAuth();
  const db = getFirestore(app);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  if (accessToken?.value === undefined) {
    return typedJson<ResponsePostBody>(
      {
        response: "unAuthorized",
        message: "로그인 된 상태가 아닙니다.",
      },
      { status: 401 }
    );
  }

  const decodedToken = await getAdminAuth().verifyIdToken(accessToken.value);
  const uid = decodedToken.uid;

  auth.languageCode = "ko";
  console.log("회원가입 하려는 user:", uid);

  if (!uid)
    return typedJson<ResponsePostBody>(
      {
        response: "unAuthorized",
        message: "토큰이 만료되었거나 정상 토큰이 아닙니다.",
      },
      { status: 401 }
    );

  const { name, nickname, phoneNumber, email } = await req.json();
  try {
    await setDoc(doc(db, "users", uid), {
      grade: "basic",
      createdAt: new Date(),
      updatedAt: new Date(),
      name,
      nickname,
      email,
      phoneNumber,
    });

    console.log("회원가입 성공!");
    return typedJson<ResponsePostBody>(
      { response: "ok", message: "회원가입 성공!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("회원가입 에러!! ", error);
    return typedJson<ResponsePostBody>(
      { response: "ng", message: error.code },
      { status: 500 }
    );
  }
}
