import LoadingBar from "@/src/shared/ui/loadingBar";
import { Suspense } from "react";
import { Timestamp } from "firebase/firestore";
import { getUserData } from "@/src/views/signup";
import { getReviewDetailData } from "@/src/views/review";
import { ReviewDetailPage } from "@/src/views/review/form/ui/ReviewDetailPage";

type PageProps = {
  params: { docId: string };
  searchParams: { password: string };
};

interface IReviewDetailData {
  response: string;
  message: string;
  data: {
    htmlString: string;
    createdAt: Timestamp;
    franchisee: string;
    name: string;
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

export default async function Page({ params }: PageProps) {
  const { docId } = params;
  const data: IReviewDetailData = await getReviewDetailData({
    docId,
  });
  const userData: IUserData = await getUserData();

  if (data.message === "Error getting document") {
    throw new Error("Error getting document");
  }

  return (
    <Suspense fallback={<LoadingBar />}>
      <ReviewDetailPage data={data} userData={userData} docId={docId} />
    </Suspense>
  );
}
