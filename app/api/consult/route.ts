import { firebaseApp } from "@/src/shared/config/firebase";
import { loadConsultParams } from "@/src/shared/searchParams";
import { typedJson } from "@/src/shared/utils";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  QuerySnapshot,
  query,
  orderBy,
  limit,
  startAt,
  startAfter,
  getCountFromServer,
  FirestoreDataConverter,
  Timestamp,
  where,
} from "firebase/firestore";
import { NextRequest } from "next/server";
import { title } from "process";

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
  message: string;
  consultData: ConsultData[];
  totalDataLength: number;
}

export async function GET(req: Request) {
  const { page, hideSecret } = loadConsultParams(req);
  const PAGE_SIZE = 10;
  const preloadCount = 1;

  const totalToFetch = PAGE_SIZE * preloadCount;
  const startAtIndex = (page - 1) * PAGE_SIZE;
  try {
    const app = firebaseApp;
    const db = getFirestore(app);
    const consultDocRef = collection(db, "consults").withConverter(
      consultConverter
    );

    // 쿼리 베이스 설정
    let baseQuery = query(
      consultDocRef,
      orderBy("createdAt", "desc"),
      ...(hideSecret === "true" ? [where("secret", "==", false)] : [])
    );

    // 먼저 전체 필터링된 데이터 수를 가져오기 (페이지네이션 계산용)
    const filteredSnap = await getDocs(baseQuery);
    const totalDataLength = (await getCountFromServer(consultDocRef)).data()
      .count;
    let paginatedQuery = baseQuery;

    if (startAtIndex > 0) {
      const startAtDoc = filteredSnap.docs[startAtIndex];
      if (startAtDoc) {
        paginatedQuery = query(
          paginatedQuery,
          startAt(startAtDoc),
          limit(totalToFetch)
        );
      } else {
        paginatedQuery = query(paginatedQuery, limit(totalToFetch));
      }
    } else {
      paginatedQuery = query(paginatedQuery, limit(totalToFetch));
    }

    const snapShot = await getDocs(paginatedQuery);
    const consults = snapShot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return typedJson<ResponseBody>(
      { message: "ok", consultData: consults, totalDataLength },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error getting document:", error);
    return typedJson<ResponseBody>(
      {
        message: "Error getting document",
        consultData: [],
        totalDataLength: 0,
      },
      { status: 500 }
    );
  }
}

const consultConverter: FirestoreDataConverter<ConsultData> = {
  toFirestore(data: ConsultData) {
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      ...data,
    } as ConsultData;
  },
};
