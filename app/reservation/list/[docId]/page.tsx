import LoadingBar from "@/src/shared/ui/loadingBar";
import {
  getConsultDetailData,
  ReservationDetailPage,
} from "@/src/views/reservation";
import { Suspense } from "react";
import { Timestamp } from "firebase/firestore";
import { getUserData } from "@/src/views/signup";

type PageProps = {
  params: { docId: string };
  searchParams: { password: string };
};

interface IConsultDetailData {
  response: string;
  message: string;
  data: {
    bornDate: string | null;
    content: string;
    createdAt: Timestamp;
    franchisee: string;
    location: string;
    name: string;
    password: string | null;
    phoneNumber: string;
    secret: false;
    title: string;
    updatedAt: Timestamp;
    userId: string | null;
    comments:
      | {
          id: string;
          userId: string;
          createdAt: Timestamp;
          updatedAt: Timestamp;
          comment: string;
        }[]
      | null;
  };
}

interface IUserData {
  response: "ok" | "ng" | "unAuthorized";
  message: string;
  accessToken: string | null;
  userData: {
    uid: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    email: string;
    grade: string;
    name: string;
    nickname: string;
    phoneNumber: string;
  } | null;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { docId } = params;
  const { password } = searchParams;
  const data: IConsultDetailData = await getConsultDetailData({
    docId,
    password,
  });
  const userData: IUserData = await getUserData();

  if (data.message === "Error getting document") {
    throw new Error("Error getting document");
  }

  return (
    <Suspense fallback={<LoadingBar />}>
      <ReservationDetailPage data={data} userData={userData} docId={docId} />
    </Suspense>
  );
}
