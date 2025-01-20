import { loadSearchParams } from "@/src/shared/searchParams";
import { getData, ReviewPage } from "../index";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export const ReviewServerComponent = async ({ searchParams }: PageProps) => {
  const { page } = await loadSearchParams(searchParams);
  const { data } = await getData(page);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewPage data={data} />
    </Suspense>
  );
};
