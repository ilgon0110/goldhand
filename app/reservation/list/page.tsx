import LoadingBar from "@/src/shared/ui/loadingBar";
import {
  ReservationListPage,
  getReservationListData,
} from "@/src/views/reservation";
import { Suspense } from "react";
import { loadConsultParams } from "@/src/shared/searchParams";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const { page, hideSecret } = await loadConsultParams(searchParams);
  const data = await getReservationListData({
    page,
    hideSecret,
  });

  return (
    <Suspense fallback={<LoadingBar />}>
      <ReservationListPage data={data} />
    </Suspense>
  );
}
