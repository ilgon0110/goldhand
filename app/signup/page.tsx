import LoadingBar from "@/src/shared/ui/loadingBar";
import { getUserData, getSignUpData, SignupPage } from "@/src/views/signup";
import { Suspense } from "react";

interface IUserData {
  response: string;
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
  };
}
export default async function Page() {
  const userData: IUserData = await getUserData();
  //const signUpData = await getSignUpData();

  return (
    <Suspense fallback={<LoadingBar />}>
      <SignupPage userData={userData} />
    </Suspense>
  );
}
