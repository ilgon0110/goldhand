import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { firebaseApp } from "@/src/shared/config/firebase";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { typedJson } from "@/src/shared/utils";

interface ResponseGetBody {
  response: "ok" | "ng" | "unAuthorized";
  message: string;
  accessToken: string | null;
}

interface ResponsePostBody {
  response: string;
  message: string;
  redirectTo: string;
  user: UserCredential | null;
  accessToken: string | null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { provider: string } },
  res: NextApiResponse
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  if (accessToken === undefined) {
    return typedJson<ResponseGetBody>(
      {
        response: "unAuthorized",
        message: "로그인되지 않았습니다.",
        accessToken: null,
      },
      { status: 401 }
    );
  }

  // 여기서 실제 accessToken이 유효한지 확인하고, 유효하지 않으면 unauthorized 처리
  try {
    const decodedToken = await getAdminAuth().verifyIdToken(accessToken.value);
    const uid = decodedToken.uid;
    console.log("auth uid:", uid);

    return typedJson<ResponseGetBody>(
      {
        response: "ok",
        message: "로그인 된 상태입니다.",
        accessToken: accessToken.value,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying token:", error);
    console.log("errorCode:", error.code);

    if (error.code === "auth/id-token-expired") {
      return typedJson<ResponseGetBody>(
        {
          response: "unAuthorized",
          message: "토큰이 만료되었습니다.",
          accessToken: null,
        },
        { status: 401 }
      );
    }

    return typedJson<ResponseGetBody>(
      { response: "ng", message: error.code, accessToken: null },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { access_token } = await req.json();

  // naver ACCESS_TOKEN을 이용하여 사용자 정보를 가져온다.
  if (typeof access_token === "string") {
    const profileData = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
    });

    const userData = await profileData.json();
    const email = userData.response.email;
    const user = await trySignIn(
      email,
      process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!
    );

    // firebase auth에 로그인된 유저가 있는지 확인
    if (user) {
      try {
        const accessToken = user.user.accessToken;
        console.log("accessToken:", accessToken);
        await setAuthCookie(accessToken);

        return typedJson<ResponsePostBody>(
          {
            response: "ok",
            message: "로그인 정보 확인",
            redirectTo: "/",
            user,
            accessToken,
          },
          { status: 200 }
        );
      } catch (error: any) {
        console.error("Error setting cookie:", error);
        return typedJson<ResponsePostBody>(
          {
            response: "ng",
            message: error.code,
            redirectTo: "/login",
            user: null,
            accessToken: null,
          },
          { status: 500 }
        );
      }
    }

    // OAuth로그인은 성공했으나 firebase에 정보 없는 유저 - 회원가입
    try {
      const newUser = await signUpUser(
        email,
        process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!
      );
      await setAuthCookie(newUser.user.stsTokenManager.accessToken);
      console.log('"newUser:"', newUser.user.uid);
      await saveUserProfile(newUser.user.uid, email);

      return typedJson<ResponsePostBody>(
        {
          redirectTo: "/signup",
          user: newUser,
          response: "ok",
          message: "oAuth 로그인 성공, 회원가입 페이지로 이동합니다.",
          accessToken: newUser.user.stsTokenManager.accessToken,
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Error signing up:", error);
      return typedJson<ResponsePostBody>(
        {
          redirectTo: "/",
          response: "ng",
          message: error.code,
          user: null,
          accessToken: null,
        },
        { status: 500 }
      );
    }
  }
}

async function trySignIn(email: string, password: string) {
  const auth = getAuth();
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error: any) {
    if (error.code === "auth/invalid-credential") {
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
  return await setDoc(doc(db, "users", uid), {
    email: email,
    provider: "naver",
    uid,
    createdAt: new Date(),
    updatedAt: new Date(),
    grade: "basic",
    point: 0,
    name: "",
    nickname: "",
    phoneNumber: "",
  });
}

async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
  });
}
