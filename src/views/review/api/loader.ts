export const getReviewDetailData = async ({ docId }: { docId: string }) => {
  const apiUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:3000";

  const res = await fetch(`${apiUrl}/api/review/detail?docId=${docId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  return res.json();
};

export async function getReviewListData(page: number) {
  const apiUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:3000";
  const res: Response = await fetch(`${apiUrl}/api/review?page=${page}`, {
    cache: "no-cache",
  });
  -0;
  if (!res.ok) {
    throw new Error("데이터 fetch 실패!!");
  }

  return res.json();
}
