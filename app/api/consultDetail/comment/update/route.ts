import { firebaseApp } from "@/src/shared/config/firebase";
import { typedJson } from "@/src/shared/utils";
import bcrypt from "bcryptjs";
import {
  collection,
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

export async function POST(req: NextRequest) {
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

  // UPDATE Logic...
  try {
    const app = firebaseApp;
    const db = getFirestore(app);
    const commentDocRef = doc(db, "consults", docId, "comments", commentId);
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

    const targetCommentData = commentDocSnap.data() as CommentData;
    console.log("targetCommentData:", targetCommentData);
    const updatedCommentData = {
      ...targetCommentData,
      comment,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(commentDocRef, updatedCommentData);
    console.log("Comment updated successfully:", updatedCommentData);
    return typedJson<ResponseBody>(
      { response: "ok", message: "댓글 수정 성공" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating Document:", error);
    return typedJson<ResponseBody>(
      { response: "ng", message: "댓글 수정 중 서버 오류가 발생하였습니다." },
      { status: 500 }
    );
  }
}
