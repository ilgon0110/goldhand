import { firebaseApp } from "@/src/shared/config/firebase";
import { typedJson } from "@/src/shared/utils";
import bcrypt from "bcryptjs";
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { NextRequest } from "next/server";

interface ConsultPost {
  docId: string;
  userId: string;
  password: string | null;
}

interface ConsultData extends ConsultPost {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  comments: CommentData[] | null;
}

interface CommentData {
  id: string;
  comment: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
}

interface ResponseBody {
  response: "ok" | "ng" | "expired" | "unAuthorized";
  message: string;
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json()) as ConsultPost;
  const { docId, userId, password } = body;

  if (!docId) {
    return typedJson<ResponseBody>(
      { response: "ng", message: "docId is required" },
      { status: 400 }
    );
  }

  // Delete logic here...
  try {
    const app = firebaseApp;
    const db = getFirestore(app);
    const consultDocRef = doc(db, "consults", docId);
    const docSnap = await getDoc(consultDocRef);

    if (!docSnap.exists()) {
      return typedJson<ResponseBody>(
        {
          response: "ng",
          message: "해당 docId를 가진 게시글이 존재하지 않습니다.",
        },
        { status: 404 }
      );
    }
    const targetData = docSnap.data() as ConsultData;

    // 비회원인 경우
    if (targetData.userId === null) {
      if (password === null) {
        return typedJson<ResponseBody>(
          { response: "ng", message: "비밀번호를 입력해주세요." },
          { status: 401 }
        );
      }

      // 비회원인 경우 비밀번호 검증
      const isMatch = await bcrypt.compare(password, targetData.password || "");
      if (!isMatch) {
        return typedJson<ResponseBody>(
          {
            response: "unAuthorized",
            message: "비밀번호가 일치하지 않습니다.",
          },
          { status: 401 }
        );
      }

      // 비회원이면서 비밀번호가 일치하는 경우만 삭제 가능
      await deleteDoc(consultDocRef);

      return typedJson<ResponseBody>(
        {
          response: "ok",
          message: "게시글이 정상적으로 삭제되었습니다.",
        },
        { status: 200 }
      );
    }
    // 회원인 경우
    else {
      // 회원일 땐 userId로 비교
      if (targetData.userId !== userId) {
        return typedJson<ResponseBody>(
          { response: "unAuthorized", message: "게시글 삭제 권한이 없습니다." },
          { status: 401 }
        );
      }

      // 회원이면서 userId가 일치하는 경우만 삭제 가능
      await deleteDoc(consultDocRef);

      return typedJson<ResponseBody>(
        {
          response: "ok",
          message: "게시글이 정상적으로 삭제되었습니다.",
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Error updating Document:", error);
    return typedJson<ResponseBody>(
      { response: "ng", message: "게시글 삭제 중 서버 오류가 발생하였습니다." },
      { status: 500 }
    );
  }
}
