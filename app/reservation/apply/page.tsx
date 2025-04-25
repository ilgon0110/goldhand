import LoadingBar from "@/src/shared/ui/loadingBar";
import { ReservationApplyPage } from "@/src/views/reservation";
import { Suspense } from "react";

export default async function Page() {
  return (
    <Suspense fallback={<LoadingBar />}>
      <ReservationApplyPage />
    </Suspense>
  );
}
