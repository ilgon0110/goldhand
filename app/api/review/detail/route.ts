import { firebaseApp } from "@/src/shared/config/firebase";
import { loadConsultDetailParams } from "@/src/shared/searchParams";
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
  Timestamp,
} from "firebase/firestore";
import { NextRequest } from "next/server";

interface ConsultData {
  bornDate: Date | null;
  content: string;
  createdAt: Timestamp;
  franchisee: string;
  location: string;
  name: string;
  password: string | null;
  phoneNumber: string;
  secret: boolean;
  title: string;
  updatedAt: Timestamp;
  userId: string | null;
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
  data: ConsultData;
}

const defaultData = {
  bornDate: null,
  content: "",
  createdAt: Timestamp.now(),
  franchisee: "",
  location: "",
  name: "",
  password: null,
  phoneNumber: "",
  secret: false,
  title: "",
  updatedAt: Timestamp.now(),
  userId: null,
  comments: null,
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const docId = searchParams.get("docId");

  if (!docId) {
    return typedJson<ResponseBody>(
      {
        response: "ng",
        message: "docId is required",
        data: defaultData,
      },
      { status: 400 }
    );
  }
  try {
    const app = firebaseApp;
    const db = getFirestore(app);
    const reviewDocRef = doc(db, "reviews", docId);
    const docSnap = await getDoc(reviewDocRef);

    if (!docSnap.exists()) {
      return typedJson<ResponseBody>(
        {
          response: "ng",
          message: "no such document",
          data: defaultData,
        },
        { status: 404 }
      );
    }

    const data = docSnap.data() as ConsultData;

    const commentsRef = collection(db, "reviews", docId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));

    const commentSnapshot = await getDocs(q);
    const comments = commentSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CommentData[];

    const responseData: ResponseBody = {
      response: "ok",
      message: "ok",
      data: {
        ...data,
        comments,
      },
    };
    return typedJson<ResponseBody>(responseData, { status: 200 });
  } catch (error) {
    console.error("Error getting document:", error);
    return typedJson<ResponseBody>(
      {
        response: "ng",
        message: "Error getting document",
        data: defaultData,
      },
      { status: 500 }
    );
  }
}
