import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export async function getData(page: number) {
  const apiUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:3000";
  const res: Response = await fetch(`${apiUrl}/api/review?page=${page}`);
  -0;
  if (!res.ok) {
    throw new Error("데이터 fetch 실패!!");
  }

  return res.json();
}
