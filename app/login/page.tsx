import LoadingBar from "@/src/shared/ui/loadingBar";
import { getLoginData, LoginPage } from "@/src/views/login";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  const loginData = await getLoginData("naver");

  console.log("loginData1: ", loginData);

  return (
    <Suspense fallback={<LoadingBar />}>
      <LoginPage data={loginData} />
    </Suspense>
  );
}
