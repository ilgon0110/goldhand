import { firebaseApp } from "@/src/shared/config/firebase";
import { typedJson } from "@/src/shared/utils";
import bcrypt from "bcryptjs";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { NextRequest } from "next/server";

interface CommentPost {
  docId: string;
  commentId: string;
  comment: string;
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
  const body = (await req.json()) as CommentPost;
  const { docId, commentId, comment } = body;

  if (!docId) {
    return typedJson<ResponseBody>(
      { response: "ng", message: "docId is required" },
      { status: 400 }
    );
  }

  if (!commentId) {
    return typedJson<ResponseBody>(
      { response: "ng", message: "commentId is required" },
      { status: 400 }
    );
  }

  // Delete logic here...
  try {
    const app = firebaseApp;
    const db = getFirestore(app);
    const commentDocRef = doc(db, "reviews", docId, "comments", commentId);
    const commentDocSnap = await getDoc(commentDocRef);

    if (!commentDocSnap.exists()) {
      return typedJson<ResponseBody>(
        {
          response: "ng",
          message: "해당 commentId를 가진 댓글이 존재하지 않습니다.",
        },
        { status: 404 }
      );
    }

    await deleteDoc(commentDocRef);

    return typedJson<ResponseBody>(
      {
        response: "ok",
        message: "댓글이 삭제되었습니다.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating Document:", error);
    return typedJson<ResponseBody>(
      { response: "ng", message: "댓글 삭제 중 서버 오류가 발생하였습니다." },
      { status: 500 }
    );
  }
}
