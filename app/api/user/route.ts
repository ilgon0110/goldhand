import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/src/shared/config/firebase";
import { cookies } from "next/headers";
import { typedJson } from "@/src/shared/utils";
import { doc, DocumentData, getDoc, getFirestore } from "firebase/firestore";
import { getAuth as getAdminAuth, UserRecord } from "firebase-admin/auth";

interface ResponseBody {
  response: "ok" | "ng" | "unAuthorized";
  message: string;
  accessToken: string | null;
  userData: DocumentData | null;
}

export async function GET(request: Request) {
  // 현재 로그인된 유저의 uid를 가져온다.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const app = firebaseApp;
  const auth = getAuth();
  const db = getFirestore(app);

  if (!accessToken) {
    return typedJson<ResponseBody>(
      {
        response: "ng",
        message: "로그인 토큰이 존재하지 않습니다.",
        accessToken: null,
        userData: null,
      },
      { status: 403 }
    );
  }

  try {
    const decodedToken = await getAdminAuth().verifyIdToken(accessToken.value);
    const uid = decodedToken.uid;
    console.log("uid:", uid);

    if (uid === undefined) {
      return typedJson<ResponseBody>(
        {
          response: "ng",
          message: "사용자 식별 아이디가 존재하지 않습니다.",
          accessToken: null,
          userData: null,
        },
        { status: 403 }
      );
    }

    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      console.log("User data:", userData);

      return typedJson<ResponseBody>(
        {
          response: "ok",
          message: "로그인 정보 확인",
          accessToken: accessToken.value,
          userData: { ...userData, uid },
        },
        { status: 200 }
      );
    }

    return typedJson<ResponseBody>(
      {
        response: "ng",
        message: "해당 uid를 가진 유저가 존재하지 않습니다.",
        accessToken: accessToken.value,
        userData: null,
      },
      { status: 404 }
    );
  } catch (error: any) {
    console.log("api/user errorCode:", error.code);

    if (error.code === "auth/id-token-expired") {
      console.log("토큰 만료됨");
      return typedJson<ResponseBody>(
        {
          response: "unAuthorized",
          message: "토큰 만료됨",
          accessToken: null,
          userData: null,
        },
        { status: 401 }
      );
    }

    return typedJson<ResponseBody>(
      {
        response: "ng",
        message: "해당 토큰을 가진 유저가 존재하지 않습니다.",
        accessToken: null,
        userData: null,
      },
      { status: 403 }
    );
  }
}
