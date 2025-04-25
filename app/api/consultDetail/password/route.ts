import { firebaseApp } from "@/src/shared/config/firebase";
import { typedJson } from "@/src/shared/utils";
import bcrypt from "bcryptjs";
import { doc, getDoc, getFirestore, Timestamp } from "firebase/firestore";
import { NextRequest } from "next/server";

interface ConsultData {
  bornDate: Date | null;
  content: string;
  createAt: Timestamp;
  franchisee: string;
  location: string;
  name: string;
  password: string | null;
  phoneNumber: string;
  secret: boolean;
  title: string;
  updatedAt: Timestamp;
  userId: string | null;
}

interface ResponseBody {
  response: "ok" | "ng" | "expired" | "unAuthorized";
  message: string;
  data: ConsultData;
}

const defaultData = {
  bornDate: null,
  content: "",
  createAt: Timestamp.now(),
  franchisee: "",
  location: "",
  name: "",
  password: null,
  phoneNumber: "",
  secret: false,
  title: "",
  updatedAt: Timestamp.now(),
  userId: null,
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const docId = searchParams.get("docId");
  const password = searchParams.get("password");
  console.log("secretDocId", docId);
  console.log("password", password);

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
    const consultDocRef = doc(db, "consults", docId);
    const docSnap = await getDoc(consultDocRef);

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

    if (password === null) {
      return typedJson<ResponseBody>(
        {
          response: "unAuthorized",
          message: "password is required",
          data: defaultData,
        },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, data.password || "");

    if (!isMatch) {
      return typedJson<ResponseBody>(
        {
          response: "unAuthorized",
          message: "비밀번호가 틀립니다.",
          data: defaultData,
        },
        { status: 403 }
      );
    }

    const responseData: ResponseBody = {
      response: "ok",
      message: "ok",
      data: { ...data },
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
