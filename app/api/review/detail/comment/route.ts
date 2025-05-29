import { firebaseApp } from "@/src/shared/config/firebase";
import { typedJson } from "@/src/shared/utils";
import { addDoc, collection, getFirestore } from "@firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

interface ResponsePostBody {
  response: "ok" | "ng" | "expired" | "unAuthorized";
  message: string;
}

export async function POST(request: NextRequest) {
  // 회원이고, 로그인되어있는지 확인
  // 현재 로그인된 유저의 uid를 가져온다.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken) {
    return typedJson<ResponsePostBody>(
      {
        response: "unAuthorized",
        message: "로그인 후 사용해주세요.",
      },
      {
        status: 401,
      }
    );
  }

  // request body에서 docId와 comment를 가져옴
  const { docId, comment } = await request.json();

  // docId가 없으면 에러 반환
  if (!docId) {
    return typedJson<ResponsePostBody>(
      {
        response: "ng",
        message: "docId is required",
      },
      { status: 404 }
    );
  }

  // 댓글 생성
  try {
    const app = firebaseApp;
    const auth = getAuth();
    const db = getFirestore(app);
    const decodedToken = await getAdminAuth().verifyIdToken(accessToken.value);
    const uid = decodedToken.uid;

    if (!uid) {
      return typedJson<ResponsePostBody>(
        {
          response: "unAuthorized",
          message: "로그인 후 사용해주세요.",
        },
        {
          status: 403,
        }
      );
    }

    const commentRef = collection(db, "reviews", docId, "comments");
    const response = await addDoc(commentRef, {
      comment,
      userId: uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (response) {
      return typedJson<ResponsePostBody>(
        {
          response: "ok",
          message: "댓글이 생성되었습니다.",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error: any) {
    console.error("Error getting api/reviews/comment:", error);
    if (error.code === "auth/id-token-expired") {
      return typedJson<ResponsePostBody>(
        { response: "expired", message: "토큰이 만료되었습니다." },
        { status: 401 }
      );
    }

    return typedJson<ResponsePostBody>(
      {
        response: "ng",
        message: "Error getting document",
      },
      { status: 500 }
    );
  }
}
