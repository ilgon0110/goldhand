export const getReviewDetailData = async ({ docId }: { docId: string }) => {
  const apiUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:3000";

  const res = await fetch(`${apiUrl}/api/reviewDetail?docId=${docId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  return res.json();
};
