import { loadSearchParams } from "@/src/shared/searchParams";
import { type IReviewData } from "../index";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export async function getData(page: number) {
  const res: Response = await fetch(
    `${process.env.BASE_URL}/api/review?page=${page}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
