import { loadSearchParams } from "@/src/shared/searchParams";
import LoadingBar from "@/src/shared/ui/loadingBar";
import { getReviewListData, ReviewPage } from "@/src/views/review";
import { getUserData } from "@/src/views/signup";
import { Timestamp } from "firebase/firestore";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

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

export default async function Page({ searchParams }: PageProps) {
  const { page } = await loadSearchParams(searchParams);
  const data = await getReviewListData(page);
  const userData: IUserData = await getUserData();
  return (
    <Suspense fallback={<LoadingBar />}>
      <ReviewPage data={data} isLogin={userData.response === "ok"} />
    </Suspense>
  );
}
