"use client";

import LoadingBar from "@/src/shared/ui/loadingBar";
import { ReviewFormPage } from "@/src/views/review";
import { getUserData } from "@/src/views/signup";
import { ImagesContext } from "@/src/widgets/editor/context/ImagesContext";
import { Suspense } from "react";

type PageProps = {
  params: { slug: string };
  searchParams: { docId: string | undefined };
};

interface IUserData {
  response: "ok" | "ng" | "unAuthorized";
  message: string;
  accessToken: string | null;
  userData: {
    phoneNumber: string;
    email: string;
    provider: string;
    point: number;
    uid: string;
    grade: string;
    createdAt: { seconds: number; nanoseconds: number };
    nickname: string;
    name: string;
    updatedAt: { seconds: number; nanoseconds: number };
  } | null;
}

export default function Page() {
  //const userData: IUserData = await getUserData();
  //const reviewDetailData = await getReviewDetailData({
  //  docId: searchParams.docId || "",
  //});

  return (
    <Suspense fallback={<LoadingBar />}>
      <ImagesContext>
        <ReviewFormPage />
      </ImagesContext>
    </Suspense>
  );
}
