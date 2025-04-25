import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { firebaseAdminApp } from "@/src/shared/config/firebase-admin";
import { typedJson } from "@/src/shared/utils";

interface ResponseBody {
  response: "ok" | "ng" | "unAuthorized";
  message: string;
  accessToken: string | null;
}

export async function POST(req: Request): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const app = firebaseAdminApp;

  if (!accessToken) {
    return typedJson<ResponseBody>(
      {
        response: "unAuthorized",
        message: "로그인되지 않았습니다.",
        accessToken: null,
      },
      { status: 401 }
    );
  }
  // firebase에서 accessToken을 검증하는 로직
  try {
    const decodedToken = await getAdminAuth().verifyIdToken(accessToken.value);
    const uid = decodedToken.uid;
    console.log("refresh uid:", uid);

    return typedJson<ResponseBody>(
      {
        response: "ok",
        message: "로그인 확인",
        accessToken: accessToken.value,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying token:", error);
    console.log("errorCode:", error.code);

    if (error.code === "auth/id-token-expired") {
      console.log("토큰 만료됨");
    }

    return typedJson<ResponseBody>(
      { response: "unAuthorized", message: "토큰 만료됨", accessToken: null },
      { status: 401 }
    );
  }
}
