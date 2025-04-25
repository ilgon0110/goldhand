import LoadingBar from "@/src/shared/ui/loadingBar";
import { getConsultDetailData } from "@/src/views/reservation";
import { ReservationFormPage } from "@/src/views/reservation/form";
import { getUserData } from "@/src/views/signup";
import { Suspense } from "react";

type PageProps = {
  params: { slug: string };
  searchParams: { docId: string | undefined; password: string | undefined };
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

export default async function Page({ params, searchParams }: PageProps) {
  const userData: IUserData = await getUserData();
  const consultDetailData = await getConsultDetailData({
    docId: searchParams.docId || "",
    password: searchParams.password || "",
  });
  console.log("form docId", searchParams.docId);
  console.log("form password", searchParams.password);
  console.log("form consultDetailData", consultDetailData);

  return (
    <Suspense fallback={<LoadingBar />}>
      <ReservationFormPage
        userData={userData}
        consultDetailData={consultDetailData}
      />
    </Suspense>
  );
}
