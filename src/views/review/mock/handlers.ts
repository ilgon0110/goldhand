import { loadSearchParams } from "@/src/shared/searchParams";
import { type IReviewData } from "../index";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export async function getData(page: number) {
  const res: Response = await fetch(
    `http://localhost:3000/api/review?page=${page}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
